
import { AppWidgetProvider } from 'react-native-android-widget';

export default class MyWidgetProvider extends AppWidgetProvider {
  onUpdate(appWidgetIds) {
    this.updateWidget(appWidgetIds, {
      layout: 'widget_layout',
      data: {
        title: 'Home Screen Widget',
        message: 'Welcome to the Home Screen!',
      },
    });
  }
}