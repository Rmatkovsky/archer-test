# To work with the project you have to:

- Install nodejs and dependencies:

```
$ sudo apt-get install nodejs ; or just download and run installer if you are a lucky windows/mac user ^_^

; Go to project's directory

$ npm install
$ npm gulp install -g ; Install Gulp (task runner) globally to be accessible in CLI
```

- Run Gulp task runner

```
$ gulp build; You can specify a specific task if you need, otherwise default task will be used
$ gulp server;
```

Now you can start editing sources and enjoy yourself.


Во-1, мы пишем код на ES6/7

Во-2, галп и реквайр мы не используем, придерживаемся импорт/вебпак

В-3, взагали, конд написан так, как будто какой-то постпроцессор типа бабеля его генерил, слишком много лишнего кода, который по сути не нужен для решения задачи.

В-4, есть такой документ - Ангуляр Стайл Гайд: https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md, а код в репозитории на него крепко положил, что весьма печалит.

5. проект после сборки и запуска сервера gulp server выдает Cannot GET /

6. Все модели в папке моделс описаны в подобной структуре. Следовательно, можно было написать один параметрический модуль который генерит модель по параметру

7. Недочетов и ошибок прилично, все не описывал, что смог - откомментил в файлах
