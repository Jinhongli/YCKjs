# 闭包

## 定义

宏观意义上的闭包是指：**在当前作用域能够访问另外作用域下的变量**，狭义上的闭包定义是：

    > 在函数返回之后（在外部作用域下），能够记住并访问其词法作用域下的变量

举个栗子：

```javascript
function foo() {
	var a = 2;
	function bar() {
		console.log( a ); // 2
	}
	bar();
}
foo();
```

在执行`console.log( a );`时，`a`变量在`foo`作用域中，因此我们在Chrome调试工具中看到的作用域链就是：`Local(bar) -> Closure(foo) -> Global`，但实际上，这并没有什么卵用，JS本身就是词法作用域的，貌似没有讲闭包之前它也是这样的。

如果将代码变一下，接先来就是见证奇迹的一刻，出来吧，闭包！：

```javascript
function foo() {
	var a = 2;
	function bar() {
		console.log( a );
	}
	return bar;
}
var baz = foo();
baz(); // 2，看！foo 已经执行完了，但是依然能够查询到内部变量 a 的值
```

正常情况下，**垃圾收集器** 会在函数执行完毕之后将内部变量回收，但是由于`foo`函数的返回值，对`a`仍然有引用，因此阻止了回收。这才是通常意义上的JS闭包。

## 使用

### 保存执行环境

闭包其实无处无在，比如`setTimeout`、事件回调等等。

举一个比较常见的栗子，`for`循环：

```javascript
for (var i=1; i<=5; i++) {
	setTimeout( function timer(){
		console.log( i );
	}, i*1000 );
}
```

没有学习闭包之前，你肯定会认为每1s中会打印1, 2, 3...。但是注意`i`是保存在闭包中的一个变量，因此在1s之后，这段程序已经跑完了，`i`的值是6，因此会每秒打印的都是6。

那么怎么解决这个问题呢？只要将每次循环中`i`的值都分别保存在闭包中，然后指定每秒访问的`i`就可以了，具体就是：

```javascript
for (var i=1; i<=5; i++) {
    (function closureForI(i){
        setTimeout( function timer(){
    		console.log( i );
    	}, i*1000 );
    })(i);
}
```

这段代码中，每次`for`循环中，都会调用`closureForI`函数，并传入当前的`i`（这就创建了一个闭包，并保存了当前的i），然后在`timer`函数中引用的是对应的`i`，这样就OK了。

PS: 我知道你也许想说用`let`就可以了，但这是用来讲闭包的。

### 模块 & 封装

在模块开发模式中，根据最小暴露原则，我们希望别人只能访问特定的方法，因此需要将其他变量隐藏，就像这样：

```javascript
var foo = (function CoolModule(moduleId){
    var privateData = 'data';
    function changeModuleId(){
        moduleId = moduleId.toUppercase();
    }

    function getId(){
        console.log(moduleId);
    }
    function printData(){
        console.log(privateData);
    }

    return {
        getId: getId,
        printData: printData
    }
})('foo');

foo.getId(); // "foo"
foo.printData(); // "data"
```

这种模式在JS中称为 **模块**。总结起来需要满足两点：

1. 必须有一个函数，至少需要调用一次。
2. 这个函数的返回值（对象），至少包含一个内部函数（该函数对内部变量存在引用）。

### 注意

由于闭包防止了垃圾回收，因此有可能会引起 **内存泄露**，所以需要对不再使用的变量进行手动释放（赋值为`null`）

## 总结

- 闭包就是函数执行结束之后，仍然能够访问其词法作用域的机制。
- 闭包产生的方法：函数的返回值（对象或函数）包含对函数内部变量的引用。
- 闭包可以用来：
    + 保存执行环境
    + 封装（模块开发模式）

### 小测验

```javascript
var Zoo = (function ZooFactory() {
    var animals = [];

    function add(breed, name, voice) {
        var newAnimal = {
            breed: breed,
            name: name,
            voice: voice
        }
        animals.push(newAnimal);
        console.log(breed + '(' + name +') added.');
    }

    function kill(breed, name) {
        animals.forEach(function(animal, index){
            if (animal.name === name && animal.breed === breed) {
                animals.splice(index, 1);
                console.log(animal.breed + '(' + animal.name +') is dead.');
                return true;
            }
        });
        console.error(animal.breed + '(' + animal.name +') not found!');
        return false;
    }

    return {
        add: add,
        kill: kill
    }
})();
```

1. 在上面代码的基础上，添加一个神秘的管理员（没有人知道这个管理员是谁，持有**创建**这个动物园的老板知道）
2. 在`Zoo`上面添加一个方法，可以打印出所有的动物名单。结果如下：` "3 animals in the zoo: XXX, YYY, ZZZ. --- Andrew `（包括动物个数、动物名称、管理员名字）
