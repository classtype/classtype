{"filter":false,"title":"test.js","tooltip":"/test/test.js","undoManager":{"mark":0,"position":0,"stack":[[{"group":"doc","deltas":[{"start":{"row":0,"column":0},"end":{"row":424,"column":100},"action":"insert","lines":["//--------------------------------------------------------------------------------------------------","","var dump = (function() {","    var red = '\\033[31m';","    var blue = '\\033[34m';","    var green = '\\x1b[32m';","    var yellow = '\\x1b[33m';","    var reset = '\\033[0m';","    ","    var header = function(message) {","        console.log(blue);","        console.log(message, green);","    };","    var content = function(message) {","        console.log(message);","    };","    ","    return function(obj) {","        console.log(blue);","        console.log('----------------------------------------------------------------------------');","        ","        header('Console.log:');","        content(obj);","        ","        if (typeof obj == 'function' || typeof obj == 'object') {","            header('For in:');","            var msg = '---';","            for (var field in obj) {","                if (msg == '---') {","                    msg = field;","                } else {","                    msg += \"\\n\"+''+field;","                }","            }","            content(msg);","            ","            header('Keys:');","            content(Object.keys(obj));","            ","            header('GetOwnPropertyNames:');","            content(Object.getOwnPropertyNames(obj));","            ","            header('GetPrototypeOf:');","            content(Object.getPrototypeOf(obj));","        }","    };","})();","","//--------------------------------------------------------------------------------------------------","","var CT = (function() {","    ","/*--------------------------------------------------------------------------------------------------","|","| -> Копирует метод или свойство","|","|-------------------------------------------------------------------------------------------------*/","","    var copy = function(parent, child, field, warp) {","    // Получаем родительские геттер и сеттер","        var getter = parent.__lookupGetter__(field);","        var setter = parent.__lookupSetter__(field);","        ","    // Проверяем наличие геттера и сеттера","        if (getter || setter) {","            if (getter) child.__defineGetter__(field, warp ? warp(getter) : getter);","            if (setter) child.__defineSetter__(field, warp ? warp(setter) : setter);","        }","        ","    // Обычный метод или свойство","        else child[field] = warp ? warp(parent[field]) : parent[field];","    };","    ","/*--------------------------------------------------------------------------------------------------","|","| -> Проверяет наличие в объекте функции, геттера или сеттера","|","|-------------------------------------------------------------------------------------------------*/","    ","    var isMethod = function(obj, field) {","    // Функция","        if (typeof obj[field] == 'function') return true;","        ","    // Геттер","        if (obj.__lookupGetter__(field)) return true;","        ","    // Сеттер","        if (obj.__lookupSetter__(field)) return true;","        ","    // В объекте obj поле field не является не функцией, не геттером и не сеттером","        return false;","    };","    ","/*--------------------------------------------------------------------------------------------------","|","| -> Преобразовает из исходного во внутренне представление (для поиска и переопределения)","|","|-------------------------------------------------------------------------------------------------*/","    ","    var parse = function(args) {","    // Методы и свойства","        var p = [","            {},// Список типов доступа","            {}// Список методов и свойств","        ];","        ","    // Список типов доступа","        var types = {","            public: 0,// Публичные","            protected: 1,// Защищенные","            private: 2// Приватные","        };","        ","    // Проходим по списку методов и свойств","        for (var i = 0; i < args.length; i++) {","        // Тип доступа (public/protected/private)","            for (var type in args[i]);","            ","        // Название метода","            for (var field in args[i][type]);","            ","        // Сохраняем тип доступа","            p[0][field] = types[type];","            ","        // Копируем метод","            copy(args[i][type], p[1], field);","        }","        ","    // Возвращаем внутренне представление (для поиска и переопределения)","        return p;","    };","    ","/*--------------------------------------------------------------------------------------------------","|","| -> Преобразовает из исходного во внутренне представление (для конечного пользования)","|","|-------------------------------------------------------------------------------------------------*/","","    var getParams = function(child) {","    // Список параметров","        var p = [","        // Методы","            [","                {},// Публичные","                {},// Защищенные","                {}// Приватные","            ],","            ","        // Свойства","            [","                {},// Публичные","                {},// Защищенные","                {}// Приватные","            ]","        ];","        ","    // Проходим по списку методов и свойств","        for (var field in child[1]) {","        // Копируем метод","            if (isMethod(child[1], field)) {","                copy(child[1], p[0][child[0][field]], field);","            }","            ","        // Копируем свойство","            else {","                copy(child[1], p[1][child[0][field]], field);","            }","        }","        ","    // Возвращаем внутренне представление (для конечного пользования)","        return p;","    };","    ","/*--------------------------------------------------------------------------------------------------","|","| -> Переопределяет методы для одного типа","|","|-------------------------------------------------------------------------------------------------*/","","    var extendMethod = function(parent, child, warp) {","    // Проходим по списку методов","        for (var field in parent) {","        // Копируем метод","            copy(parent, child, field, warp);","        }","    };","    ","/*--------------------------------------------------------------------------------------------------","|","| -> Переопределяет свойства для одного типа","|","|-------------------------------------------------------------------------------------------------*/","    ","    var extendProperty = function(parent, child, privateField, pass) {","    // Проходим по списку свойств","        for (var field in parent) {","        // Перевод свойства в геттер и сеттер","            if (privateField) {","                (function(field) {","                    child.__defineGetter__(field, function() {","                        return this[privateField](pass)[field];","                    });","                    child.__defineSetter__(field, function(val) {","                        this[privateField](pass)[field] = val;","                    });","                })(field);","            }","            ","        // Копируем свойство","            else {","                copy(parent, child, field);","            }","        }","    };","    ","/*--------------------------------------------------------------------------------------------------","|","| -> Переопределяет методы для нескольких типов","|","|-------------------------------------------------------------------------------------------------*/","    ","    var extendMethods = function(parent, child) {","    // Проходим по списку типов доступа","        for (var i = 0; i < parent.length; i++) {","        // Проходим по списку методов","            extendMethod(parent[i], child);","        }","    };","    ","/*--------------------------------------------------------------------------------------------------","|","| -> Переопределяет свойства для нескольких типов","|","|-------------------------------------------------------------------------------------------------*/","","    var extendProperties = function(parent, child) {","    // Проходим по списку типов доступа","        for (var i = 0; i < parent.length; i++) {","        // Проходим по списку свойств","            extendProperty(parent[i], child);","        }","    };","    ","/*--------------------------------------------------------------------------------------------------","|","| -> Добавляет список методов и свойств к прототипам классов Self и Private","|","|-------------------------------------------------------------------------------------------------*/","    ","    var extendPrototype = function(Self, Private, params, privateField, pass) {","    // Добавляем список публичных методов к прототипу класса Self","    // Типы доступа: Публичны","        extendMethod(params[0][0], Self.prototype, function(method) {","            return function() {","                return method.apply(this[privateField](pass), arguments);","            }","        });","        ","    // Добавляем список публичных свойств к прототипу класса Self","    // Типы доступа: Публичны","        extendProperty(params[1][0], Self.prototype, privateField, pass);","        ","    // Добавляем список методов к прототипу класса Private","    // Типы доступа: Публичны, Защищенные, Приватные","        extendMethods(params[0], Private.prototype);","    };","    ","/*--------------------------------------------------------------------------------------------------","|","| -> Переопределяет методы","|","|-------------------------------------------------------------------------------------------------*/","","    var extend = function(parent, child, type) {","        for (var field in parent[1]) {","        // Отсеиваем методы и свойства ненужного типа","            if (parent[0][field] == type) continue;","            ","        // Отсеиваем методы и свойства","        // которые уже присутствуют в child","            if (field in child[0]) continue;","            ","        // Сохраняем тип доступа","            child[0][field] = parent[0][field];","            ","        // Копируем метод","            copy(parent[1], child[1], field);","        }","    };","    ","/*--------------------------------------------------------------------------------------------------","|","| -> Конструктор нового класса","|","|-------------------------------------------------------------------------------------------------*/","","    var constructor = function(params, parent) {","    // Название скрытого свойства","    // для доступа к приватным методам и свойствам","        var privateField = Math.random();","        ","    // Пароль для доступа к приватным методам и свойствам","        var pass = Math.random();","        ","    // Класс для приватных методов и свойств","        var Private = function() {};","        ","    // Конструктор нового класса","        var Self = function() {","        // Создаем экземпляр класса для приватных методов и свойств","            var _private = new Private();","            ","        // Добавляем список свойств к обьекту _private","        // Типы доступа: Публичны, Защищенные, Приватные","            extendProperties(params[1], _private);","            ","        // Добавляем скрытое свойство к обьекту this","        // для доступа к приватным методам и свойствам","        // через прототипные методы, геттеры, сеттеры и публичные свойства","            Object.defineProperty(this, privateField, {value: function(val) {","                if (val == pass) {","                    return _private;","                }","            }});","        };","        ","    // Добавляем список методов и свойств к прототипам классов Self и Private","        extendPrototype(Self, Private, params, privateField, pass);","        ","    // Трейт","        Self['trait'] = function() {","        // Преобразоваем из исходного во внутренне представление","        // для поиска и переопределения","            var child = parse(arguments);","            ","        // Добавляем новые или переопределяем унаследованные методы и свойства родителя","        // Типы доступа: Публичны, Защищенные","            extend(parent, child, -1);","            ","        // Преобразоваем из исходного во внутренне представление","        // для конечного пользования","            params = getParams(child);","            ","        // Добавляем список методов и свойств к прототипам классов Self и Private","            extendPrototype(Self, Private, params, privateField, pass);","        };","        ","    // Наследование","        Self['extend'] = function() {","        // Преобразоваем из исходного во внутренне представление","        // для поиска и переопределения","            var child = parse(arguments);","            ","        // Добавляем новые или переопределяем унаследованные методы и свойства родителя","        // Типы доступа: Публичны, Защищенные","            extend(parent, child, 2);","            ","        // Возвращаем конструктор нового класса","            return constructor(getParams(child), child);","        };","        ","    // Возвращаем текущий класс","        return Self;","    };","    ","/*--------------------------------------------------------------------------------------------------","|","| -> Наследование","|","|-------------------------------------------------------------------------------------------------*/","","    return {","        extend: function() {","        // Преобразоваем из исходного во внутренне представление","        // для поиска и переопределения","            var child = parse(arguments);","            ","        // Возвращаем конструктор нового класса","            return constructor(getParams(child), child);","        }","    };","})();","","//--------------------------------------------------------------------------------------------------","","var C = CT.extend(","    {static: {name0: 123}},","    {public: {name1: 123}},","    {protected: {name2: 456}},","    {private: {name3: 789}},","    {public: {setName: function() {","        this.name1 = 33;","    }}},","    {public: {func1: function() {","        return this;","    }}},","    {protected: {func2: function() {","    }}},","    {private: {func3: function() {","    }}},","    {public: {get get1() {","    }}},","    {protected: {get get2() {","    }}},","    {private: {get get3() {","    }}},","    {public: {set set1(val) {","    }}},","    {protected: {set set2(val) {","    }}},","    {private: {set set3(val) {","    }}}",");","","//--------------------------------------------------------------------------------------------------","","var t = new Date()-0;","","    for (var i = 1; i <= 100000; i++) {","        new C();","    }","    ","console.log(new Date() - t);","","//--------------------------------------------------------------------------------------------------"]}]}]]},"ace":{"folds":[],"scrolltop":0,"scrollleft":0,"selection":{"start":{"row":422,"column":28},"end":{"row":422,"column":28},"isBackwards":false},"options":{"guessTabSize":true,"useWrapMode":false,"wrapToView":true},"firstLineState":0},"timestamp":1420974520000,"hash":"78646522341c4dccbe276975100904f174fdb444"}