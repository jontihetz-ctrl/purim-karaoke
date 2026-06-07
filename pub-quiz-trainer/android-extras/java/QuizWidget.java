package com.quiziq.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.Arrays;
import java.util.Collections;
import java.util.Random;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

import javax.net.ssl.HttpsURLConnection;

public class QuizWidget extends AppWidgetProvider {

    public static final String ACTION_ANSWER = "com.quiziq.app.WIDGET_ANSWER";
    public static final String EXTRA_ANSWER_IDX = "answer_idx";
    public static final String EXTRA_WIDGET_ID = "widget_id";
    private static final String PREFS = "QuizWidgetPrefs";
    private static final String API_BASE =
        "https://pub-quiz-trainer-silk.vercel.app/api/questions?amount=5&type=multiple";

    private static final Executor exec = Executors.newSingleThreadExecutor();

    @Override
    public void onUpdate(Context ctx, AppWidgetManager mgr, int[] ids) {
        for (int id : ids) scheduleLoad(ctx, mgr, id);
    }

    @Override
    public void onReceive(Context ctx, Intent intent) {
        super.onReceive(ctx, intent);
        if (!ACTION_ANSWER.equals(intent.getAction())) return;

        int widgetId = intent.getIntExtra(EXTRA_WIDGET_ID, -1);
        int answerIdx = intent.getIntExtra(EXTRA_ANSWER_IDX, -1);
        if (widgetId < 0 || answerIdx < 0) return;

        AppWidgetManager mgr = AppWidgetManager.getInstance(ctx);
        SharedPreferences prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);

        String correct = prefs.getString("correct_" + widgetId, "");
        String optsJson = prefs.getString("options_" + widgetId, "[]");
        int correctCount = prefs.getInt("correct_count_" + widgetId, 0);
        int totalCount = prefs.getInt("total_count_" + widgetId, 0);

        try {
            JSONArray opts = new JSONArray(optsJson);
            String chosen = opts.optString(answerIdx, "");
            boolean right = chosen.equals(correct);
            totalCount++;
            if (right) correctCount++;

            prefs.edit()
                .putInt("correct_count_" + widgetId, correctCount)
                .putInt("total_count_" + widgetId, totalCount)
                .apply();

            // Show result briefly
            RemoteViews views = base(ctx);
            String resultPrefix = right ? "✓ Correct!  " : "✗ Wrong.  ";
            views.setTextViewText(R.id.widget_question, resultPrefix + correct);
            views.setTextViewText(R.id.widget_score, correctCount + "/" + totalCount);
            disableButtons(views);
            mgr.updateAppWidget(widgetId, views);

        } catch (Exception ignored) {}

        // Load next question after brief pause
        final int fc = totalCount;
        final int cc = correctCount;
        exec.execute(() -> {
            try { Thread.sleep(1800); } catch (InterruptedException ignored) {}
            scheduleLoad(ctx, mgr, widgetId);
        });
    }

    static void scheduleLoad(Context ctx, AppWidgetManager mgr, int widgetId) {
        exec.execute(() -> {
            try {
                URL url = new URL(API_BASE);
                HttpsURLConnection conn = (HttpsURLConnection) url.openConnection();
                conn.setConnectTimeout(10000);
                conn.setReadTimeout(10000);

                StringBuilder sb = new StringBuilder();
                try (BufferedReader reader = new BufferedReader(
                        new InputStreamReader(conn.getInputStream()))) {
                    String line;
                    while ((line = reader.readLine()) != null) sb.append(line);
                }
                conn.disconnect();

                JSONObject data = new JSONObject(sb.toString());
                JSONArray questions = data.getJSONArray("questions");
                if (questions.length() == 0) throw new Exception("empty");

                // Pick a random question from the batch
                JSONObject q = questions.getJSONObject(new Random().nextInt(questions.length()));

                String question = decodeHtml(q.getString("question"));
                String correctAnswer = decodeHtml(q.getString("correct_answer"));
                JSONArray incorrects = q.getJSONArray("incorrect_answers");

                // Build and shuffle options
                String[] opts = new String[Math.min(4, 1 + incorrects.length())];
                opts[0] = correctAnswer;
                for (int i = 1; i < opts.length; i++) {
                    opts[i] = decodeHtml(incorrects.getString(i - 1));
                }
                Collections.shuffle(Arrays.asList(opts));
                JSONArray shuffled = new JSONArray(Arrays.asList(opts));

                SharedPreferences prefs = ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE);
                prefs.edit()
                    .putString("correct_" + widgetId, correctAnswer)
                    .putString("options_" + widgetId, shuffled.toString())
                    .apply();

                int cc = prefs.getInt("correct_count_" + widgetId, 0);
                int tc = prefs.getInt("total_count_" + widgetId, 0);

                RemoteViews views = base(ctx);
                views.setTextViewText(R.id.widget_question, question);
                views.setTextViewText(R.id.widget_score, tc > 0 ? cc + "/" + tc : "");
                setButtons(ctx, views, widgetId, opts);
                mgr.updateAppWidget(widgetId, views);

            } catch (Exception e) {
                RemoteViews views = base(ctx);
                views.setTextViewText(R.id.widget_question, "Tap to load a question");
                int flags = pendingFlags();
                Intent reload = new Intent(ctx, QuizWidget.class);
                reload.setAction(AppWidgetManager.ACTION_APPWIDGET_UPDATE);
                reload.putExtra(AppWidgetManager.EXTRA_APPWIDGET_IDS, new int[]{widgetId});
                PendingIntent pi = PendingIntent.getBroadcast(ctx, widgetId, reload, flags);
                views.setOnClickPendingIntent(R.id.widget_question, pi);
                ctx.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
                    .edit().putString("options_" + widgetId, "[]").apply();
                mgr.updateAppWidget(widgetId, views);
            }
        });
    }

    private static void setButtons(Context ctx, RemoteViews views, int widgetId, String[] opts) {
        int[] btnIds = {R.id.btn_a, R.id.btn_b, R.id.btn_c, R.id.btn_d};
        String[] labels = {"A", "B", "C", "D"};
        int flags = pendingFlags();
        for (int i = 0; i < btnIds.length; i++) {
            views.setTextViewText(btnIds[i], labels[i]);
            Intent intent = new Intent(ctx, QuizWidget.class);
            intent.setAction(ACTION_ANSWER);
            intent.putExtra(EXTRA_WIDGET_ID, widgetId);
            intent.putExtra(EXTRA_ANSWER_IDX, i);
            PendingIntent pi = PendingIntent.getBroadcast(ctx, widgetId * 10 + i, intent, flags);
            views.setOnClickPendingIntent(btnIds[i], pi);
        }
    }

    private static void disableButtons(RemoteViews views) {
        int[] btnIds = {R.id.btn_a, R.id.btn_b, R.id.btn_c, R.id.btn_d};
        String[] labels = {"A", "B", "C", "D"};
        for (int i = 0; i < btnIds.length; i++) {
            views.setTextViewText(btnIds[i], labels[i]);
        }
    }

    private static RemoteViews base(Context ctx) {
        return new RemoteViews(ctx.getPackageName(), R.layout.quiz_widget);
    }

    private static int pendingFlags() {
        return Build.VERSION.SDK_INT >= 31
            ? PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
            : PendingIntent.FLAG_UPDATE_CURRENT;
    }

    private static String decodeHtml(String s) {
        return s.replace("&amp;", "&")
                .replace("&lt;", "<")
                .replace("&gt;", ">")
                .replace("&quot;", "\"")
                .replace("&#039;", "'")
                .replace("&ldquo;", "“")
                .replace("&rdquo;", "”")
                .replace("&lsquo;", "‘")
                .replace("&rsquo;", "’")
                .replace("&ndash;", "–")
                .replace("&mdash;", "—");
    }
}
