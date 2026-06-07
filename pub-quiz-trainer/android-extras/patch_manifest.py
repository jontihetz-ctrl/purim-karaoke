#!/usr/bin/env python3
"""Patch the Capacitor-generated AndroidManifest.xml to register the quiz widget."""
import sys

manifest_path = sys.argv[1]

with open(manifest_path, 'r') as f:
    content = f.read()

# Add RECORD_AUDIO permission if missing (needed for voice quiz in WebView)
record_audio = '    <uses-permission android:name="android.permission.RECORD_AUDIO"/>'
if 'RECORD_AUDIO' not in content:
    content = content.replace(
        '<application',
        record_audio + '\n\n    <application',
        1
    )
    print('Added RECORD_AUDIO permission')

# Add widget receiver if missing
widget_receiver = '''
        <receiver android:name=".QuizWidget" android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE"/>
                <action android:name="com.quiziq.app.WIDGET_ANSWER"/>
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/quiz_widget_info"/>
        </receiver>'''

if 'QuizWidget' not in content:
    content = content.replace('</application>', widget_receiver + '\n    </application>', 1)
    print('Added QuizWidget receiver to AndroidManifest.xml')
else:
    print('QuizWidget receiver already present')

with open(manifest_path, 'w') as f:
    f.write(content)
