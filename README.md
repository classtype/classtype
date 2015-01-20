# classtype: Это ООП библиотека для node.js

**Classtype** - позволяет создавать полноценные классы на чистом JavaScript!



## Возможности

* Полноценные области видимости (**public**, **protected**, **private**)
* Наследование
* Статические методы и свойства
* Геттеры и сеттеры
* Трейты
* Конструктор



## Установка

```
npm install --save classtype
```



## Подключение библиотеки

```js
var CT = require('classtype');
```



## Построение классов на classtype

Идея состоит в том, чтобы передавать в функцию `CT.extend()` в качестве аргументов вложенные объекты вида `{[область видимости]: {[имя свойства]: [значение по умолчанию]}}`, либо `{[область видимости]: {[имя метода]: function([параметры]) {[тело метода]}}}`


#### Пример структуры
```js
CT.extend(
    {[область видимости]: {[имя свойства]: [значение по умолчанию]}},// Свойство
    {[область видимости]: {[имя свойства]: [значение по умолчанию]}},// Свойство
    {[область видимости]: {[имя метода]: function([параметры]) {[тело метода]}}},// Метод
    {[область видимости]: {[имя метода]: function([параметры]) {[тело метода]}}}// Метод
)
```


#### Объявление класса
```js
var [имя класса] = CT.extend([объявление свойств и методов]);
```
```js
var MyClass = CT.extend(/* свойства и методы перечисленные через запятую */);
```


#### Объявление наследника класса (наследование)
```js
var [родитель] = CT.extend([объявление свойств и методов]);
var [наследник] = [родитель].extend([объявление свойств и методов]);
```
```js
var MyClass = CT.extend(/* свойства и методы перечисленные через запятую */);
var MyClass2 = MyClass.extend(/* свойства и методы перечисленные через запятую */);
```



## Полноценные области видимости

Область видимости свойства или метода может быть определена путем использования следующих ключевых слов в объявлении: public, protected или private. Доступ к свойствам и методам класса, объявленным как public (публичный), разрешен отовсюду. Модификатор protected (защищенный) разрешает доступ текущему и наследуемым классам. Модификатор private (приватный) ограничивает область видимости так, что только класс, где объявлен сам элемент, имеет к нему доступ.


### Пример #1 Объявление свойств класса

Свойства класса должны быть определены через модификаторы **public**, **protected**, или **private**.


```js
var [имя класса] = CT.extend(
    {[область видимости свойства]: {[имя свойства]: [значение по умолчанию]}}
);
```


#### Объявление свойств

```js
var MyClass = CT.extend(
    {public: {test1: '123'}},// Публичное свойство
    {protected: {test2: '123'}},// Защищенное свойство
    {private: {test3: '123'}}// Приватное свойство
);
```


#### Доступ к свойствам

```js
var MyClass = CT.extend(
    {public: {publicProperty: 'Публичный'}},
    {protected: {protectedProperty: 'Защищенный'}},
    {private: {privateProperty: 'Приватный'}},
    {public: {printHello: function() {
        console.log(this.publicProperty);
        console.log(this.protectedProperty);
        console.log(this.privateProperty);
    }}}
);

var obj = new MyClass();
console.log(obj.publicProperty); // 'Публичный'
console.log(obj.protectedProperty); // undefined
console.log(obj.privateProperty); // undefined
obj.printHello(); /* Выводит: 'Публичный'
                              'Защищенный'
                              'Приватный' */
```


### Пример #2 Наследование свойств класса

В данном примере создается класс **MyClass2**, который наследует свойства класса **MyClass** из предыдущего примера. Обратите внимание, что свойство ***privateProperty*** не наследуется.


```js
var MyClass2 = MyClass.extend();

var obj2 = new MyClass2();
console.log(obj2.publicProperty); // 'Публичный'
console.log(obj2.protectedProperty); // undefined
console.log(obj2.privateProperty); // undefined
obj2.printHello(); /* Выводит: 'Публичный'
                               'Защищенный'
                               undefined <-- Свойство privateProperty не наследуется! */
```



### Пример #3 Объявление методов класса

Методы класса должны быть определены через модификаторы **public**, **protected**, или **private**.


```js
var [имя класса] = CT.extend(
    {[область видимости метода]: {[имя метода]: function([параметры]) {[тело метода]}}}
);
```


#### Объявление методов

```js
var MyClass = CT.extend(
    {public: {method1: function(param) {/* тело метода */}}},// Публичный метод
    {protected: {method2: function(param) {/* тело метода */}}},// Защищенный метод
    {private: {method3: function(param) {/* тело метода */}}}// Приватный метод
);
```


#### Доступ к методам

```js
var MyClass = CT.extend(
    {public: {myPublic: function() {
        console.log('Публичный метод');
    }}},
    {protected: {myProtected: function() {
        console.log('Защищенный метод');
    }}},
    {private: {myPrivate: function() {
        console.log('Приватный метод');
    }}},
    {public: {printHello: function() {
        this.myPublic();
        this.myProtected();
        this.myPrivate();
    }}}
);

var obj = new MyClass();
obj.myPublic(); // 'Публичный метод'
obj.myProtected(); // TypeError: Object #<Object> has no method 'myProtected'
obj.myPrivate(); // TypeError: Object #<Object> has no method 'myPrivate'
obj.printHello(); /* Выводит: 'Публичный метод'
                              'Защищенный метод'
                              'Приватный метод' */
```



### Пример #4 Наследование методов класса

В данном примере создается класс **MyClass2**, который наследует методы класса **MyClass** из предыдущего примера. Обратите внимание, что метод ***myPrivate*** не наследуется.

```js
var MyClass2 = MyClass.extend();

var obj2 = new MyClass2();
obj2.myPublic(); // 'Публичный метод'
obj2.myProtected(); // TypeError: Object #<Object> has no method 'myProtected'
obj2.myPrivate(); // TypeError: Object #<Object> has no method 'myPrivate'
obj2.printHello(); /* Выводит: 'Публичный метод'
                               'Защищенный метод'
                               TypeError: Object #<Object> has no method 'myPrivate' */
```



## Наследование

Наследование — механизм, позволяющий описать новый класс на основе уже существующего (родительского, базового) класса. Класс-потомок может добавить собственные методы и свойства, а также пользоваться родительскими методами и свойствами. Позволяет строить иерархии классов.

В классе-наследнике могут быть переопределены любые свойства и методы любого родительского класса.


### Пример #1 Переопределение методов

В данном примере класс **MyClass2** наследует метод ***method1*** и переопределяет метод ***method2*** класса **MyClass**, а также создает новый метод ***method3***.

```js
var MyClass = CT.extend(
    {public: {method1: function() {
        console.log('Метод1');
    }}},
    {public: {method2: function() {
        console.log('Метод2');
    }}}
);

var MyClass2 = MyClass.extend(
    {public: {method2: function() {
        console.log('Переопределенный метод2');
    }}},
    {public: {method3: function() {
        console.log('Новый метод3');
    }}}
);

var obj2 = new MyClass2();
obj2.method1(); // 'Метод1'
obj2.method2(); // 'Переопределенный метод2'
obj2.method3(); // 'Новый метод3'
```



## Ключевое слово this

Для доступа к методам и свойствам текущего объекта используется ключевое слово **this**.


```js
// Доступ к свойству текущего объекта
function([параметры]) {
    this.[имя свойства];
}

// Доступ к методу текущего объекта
function([параметры]) {
    this.[имя метода]([параметры]);
}
```
```js
// Доступ к свойствам
var MyClass1 = CT.extend(
    {public: {test1: '123'}},// Публичное свойство
    {protected: {test2: '123'}},// Защищенное свойство
    {private: {test3: '123'}},// Приватное свойство
    {public: {method: function(param) {
        this.test1;// Доступ к публичному свойству
        this.test2;// Доступ к защищенному свойству
        this.test3;// Доступ к приватному свойству
    }}}
);

// Доступ к методам
var MyClass2 = CT.extend(
    {public: {method1: function(param) {/* тело метода */}}},// Публичный метод
    {protected: {method2: function(param) {/* тело метода */}}},// Защищенный метод
    {private: {method3: function(param) {/* тело метода */}}},// Приватный метод
    {public: {method4: function(param) {
        this.method1();// Доступ к публичному методу
        this.method2();// Доступ к защищенному методу
        this.method3();// Доступ к приватному методу
    }}}
);
```



## Ключевое слово this.self

Для доступа к статическим методам и свойствам текущего класса используется ключевое слово **this.self**.


```js
// Доступ к статическому свойству текущего объекта
function([параметры]) {
    this.self.[имя свойства];
}

// Доступ к статическому методу текущего класса
function([параметры]) {
    this.self.[имя метода]([параметры]);
}
```
```js
// Доступ к свойствам
var MyClass1 = CT.extend(
    {static: {public: {test1: '123'}}},// Публичное статическое свойство
    {static: {protected: {test2: '123'}}},// Защищенное статическое свойство
    {static: {private: {test3: '123'}}},// Приватное статическое свойство
    {public: {method: function(param) {
        this.self.test1;// Доступ к публичному статическому свойству
        this.self.test2;// Доступ к защищенному статическому свойству
        this.self.test3;// Доступ к приватному статическому свойству
    }}}
);

// Доступ к методам
var MyClass2 = CT.extend(
    {static: {public: {method1: function(param) {/* тело метода */}}}},// Публичный метод
    {static: {protected: {method2: function(param) {/* тело метода */}}}},// Защищенный метод
    {static: {private: {method3: function(param) {/* тело метода */}}}},// Приватный метод
    {public: {method: function(param) {
        this.self.method1();// Доступ к публичному статическому методу
        this.self.method2();// Доступ к защищенному статическому методу
        this.self.method3();// Доступ к приватному статическому методу
    }}}
);
```


Обратите внимание, что **this.self** и **this** это одно и тоже во всех статических методах!
Мы рекомендуем использовать **this.self** дабы подчеркнуть, что обращение идет к статике.

```js
var MyClass = CT.extend(
    {static: {public: {test: '123'}}},// Статическое свойство
    {static: {public: {method: function(param) {/* тело метода */}}}},// Статический метод
    {static: {public: {print: function(param) {
    // Доступ к статике внутри статики
        console.log(this.self.method1 === this.method1);// true
        console.log(this.self.test1 === this.test1);// true
        console.log(this.self === this);// true
    }}}}
);

MyClass.print();/* Выводит: true
                            true
                            true */
```



## Статические методы и свойства

Объявление свойств и методов класса статическими позволяет обращаться к ним без создания экземпляра класса.


#### Объявление свойств
```js
var [имя класса] = CT.extend(
    {static: {[область видимости]: {[имя свойства]: [значение по умолчанию]}}}
);
```
```js
var MyClass = CT.extend(
    {static: {public: {test1: '123'}}},// Публичное статическое свойство
    {static: {protected: {test2: '123'}}},// Защищенное статическое свойство
    {static: {private: {test3: '123'}}}// Приватное статическое свойство
);
```


#### Доступ к свойствам

```js
var MyClass = CT.extend(
    {static: {public: {publicProperty: 'Публичный'}}},
    {static: {protected: {protectedProperty: 'Защищенный'}}},
    {static: {private: {privateProperty: 'Приватный'}}},
    
// Доступ через статический метод
    {static: {public: {staticHello: function() {
    // Можно через общепринятый this.self
        console.log('' + this.self.publicProperty);
        console.log(this.self.protectedProperty);
        console.log(this.self.privateProperty);
        
    // Но можно и напрямую через this
        console.log(this.publicProperty);
        console.log(this.protectedProperty);
        console.log(this.privateProperty);
    }}}},
    
// Доступ через динамический метод
    {public: {hello: function() {
    // Можно только через this.self
        console.log(this.self.publicProperty);
        console.log(this.self.protectedProperty);
        console.log(this.self.privateProperty);
    }}}
);

console.log(MyClass.publicProperty); // 'Публичный'
console.log(MyClass.protectedProperty); // undefined
console.log(MyClass.privateProperty); // undefined
MyClass.staticHello(); /* Выводит: 'Публичный'
                                   'Защищенный'
                                   'Приватный'
                                   'Публичный'
                                   'Защищенный'
                                   'Приватный' */
var obj = new MyClass();
obj.hello(); /* Выводит: 'Публичный'
                         'Защищенный'
                         'Приватный' */
```


#### Объявление методов
```js
var [имя класса] = CT.extend(
    {static: {[область видимости]: {[имя метода]: function([параметры]) {[тело метода]}}}}
);
```
```js
var MyClass = CT.extend(
// Публичный статический метод
    {static: {public: {method1: function(param) {/* тело метода */}}}},
    
// Защищенный статический метод
    {static: {protected: {method2: function(param) {/* тело метода */}}}},
    
// Приватный статический метод
    {static: {private: {method3: function(param) {/* тело метода */}}}}
);
```



## Пример реализации класса на classtype

```js
var User = CT.extend(
// Статическое приватное свойство
    {static: {private: {count: 0}}},// Количество созданных юзеров

// Статический публичный метод
    {static: {public: {getCount: function() {
        return this.self.count;// Возвращаем количество созданных юзеров
    }}}},

// Динамическое защищенное свойство
    {protected: {name: '123'}},// Имя юзера
    
// Конструктор класса
    {private: {constructor: function(name) {
        this.self.count++;// Подсчитываем общее количество юзеров
        this.name = name;// Задаем имя юзеру
    }}},
    
// Динамический публичный метод
    {public: {getName: function() {
        return this.name;// Возвращаем имя юзера
    }}},
    
// Динамический публичный метод
    {public: {setName: function(name) {
        this.name = name;// Задаем новое имя юзеру
    }}}
);

var user1 = new User('Саша');
var user2 = new User('Маша');
var user3 = new User('Даша');
console.log('Всего создано юзеров: ' + User.getCount());// 3

console.log('Имя первого юзера: ' + user1.getName());// 'Саша'
user1.setName('Паша');// Задаем первому юзеру новое имя
console.log('Новое имя первого юзера: ' + user1.getName());// 'Паша'

console.log('Имя второго юзера: ' + user2.getName());// 'Маша'
console.log('Имя третьего юзера: ' + user3.getName());// 'Даша'

// Проверяем методы на прототип
console.log(user1.getName === user2.getName);// true
```



### Ссылки

* http://closure-compiler.appspot.com/home
* https://github.com/sole/tween.js/blob/master/README.md
* http://habrahabr.ru/post/177465/
* (WebSocket на ActionScript) https://github.com/theturtle32/AS3WebSocket
* (WebSocket на ActionScript) https://github.com/y8/websocket-as
* (WebSocket на ActionScript) https://github.com/zcourts/higgs-fs
* (child_process) http://millermedeiros.github.io/mdoc/examples/node_api/doc/child_processes.html#child_process.fork
* (многопоточность в node) https://kuroikaze85.wordpress.com/2010/06/21/use-several-cores-nodejs/
* (хорошая wiki документация) https://github.com/twbs/bootstrap
* https://github.com/bower/bower
* (очень хорошая документация) https://github.com/caolan/async#reject



## Ключевые слова this и this.self

В динамических методах для доступа к другим динамическим методам и свойствам текущего
объекта нужно использовать ключевое слово **this**.



В данной библиотеке доступ к свойствам и методам обеспечивает ключевое слово **this**.
В данной библиотеке доступ к свойствам и методам внутри методов обеспечивается через ключевое слово **this**.
Поведение **this** зависит от типа метода, в котором происходит вызов.
В динамических методах **this** позволяет обратиться к другим динамическим методам и свойствам.
Для доступа к статическим методам и свойствам в таких методах нужно использовать **this.self**.
В статических методах **this** обеспечивает доступ к другим статическим методам и свойствам.
Проще говоря, в статических методах и **this**, и **this.self** указывают на статические методы и свойства.



В зависимости от того, в каком типе метода мы находимся, это слово работает по разному.
В динамических методах оно позволяет обратиться к другим динамическим методам и свойствам.
В статических методах ключевое слово **this** обеспечивает доступ к статическим методам и свойствам. 



Для доступа к методам и свойствам текущего объекта используется ключевое слово **this**.
Для доступа к динамическим методам и свойствам текущего объекта используйте ключевое слово **this**.