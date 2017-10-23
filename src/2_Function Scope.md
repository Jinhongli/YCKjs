# Chapter 2. 函数作用域 & 块级作用域

## 函数作用域

JS中的函数具有词法作用域：函数外部无法访问内部变量，函数内部的任何位置都可以使用内部变量（包括内嵌的函数），这会带来一些**副作用**。

### 1. 隐藏内部实现

外部无法访问函数内部变量，换言之，可以将变量或函数隐藏在函数作用域中。这样做符合软件设计原则**最小暴露原则**。

举个栗子：

```javascript
function doSomething(a) {
	b = a + doSomethingElse( a * 2 );

	console.log( b * 3 );
}

function doSomethingElse(a) {
	return a - 1;
}

var b;

doSomething( 2 ); // 15
```

如果不想让别人使用或者看到`b`, `doSomethingElse()`，那么可以改变其位置，将其隐藏：

```javascript
function doSomething(a) {
    var b;

    function doSomethingElse(a) {
    	return a - 1;
    }

	b = a + doSomethingElse( a * 2 );

	console.log( b * 3 );
}

doSomething( 2 ); // 15
```

### 2. 避免冲突

主要有两种方式：

#### 2.1 命名空间

根据功能、类型或者作者不同，分为命名空间，说白了就是把同类的属性方法放在一个全局对象上，避免与其他同名。

举个栗子：

```javascript
var MyReallyCoolLibrary = {
	awesome: "stuff",
	doSomething: function() {
		// ...
	},
	doAnotherThing: function() {
		// ...
	}
};
```

#### 2.2 模块管理

讲JS代码分为一个一个的模块（js文件），通过模块管理器来使用它们。

### 立即执行函数

使用刚才介绍的函数作用域隐藏作用域的话，需要先声明再调用，这是不必要的。可以使用立即执行函数（IIFE）来实现：

```javascript
(function foo(){ // <-- function左边加(

	var a = 3;
	console.log( a ); // 3

})(); // <-- 最后加)();
```

用`()`将函数声明包裹起来，就会将函数声明变为函数表达式，最后再添加`()`则会立即执行该函数表达式。

**注意**：区分函数表达式和函数声明只需要确定：`function`关键字是不是在语句的句首，如果在就是函数声明；如果不在就是函数表达式

立即执行函数还可以传入参数，通常确保全局对象和`undifined`的正确性。（`undifined`可以被修改）

```javascript
var foo = 'global';
var undifined = 'defined'; // 重定义undifined

(function IIFE(global, undifined){ // <-- function左边加(

	var foo = 'local';
    console.log( foo ); // "local"
    console.log( global.foo ); // "global"
	console.log( undifined ); // undifined，无视全局修改undifined

})(window); // 第一个实参window，第二个实参为空(传入为空时，形参为undifined)

console.log(undifined); // "defined"
```

另外一种立即执行函数的范式成为UMD，通用模块定义。然而个人认为并没有什么优点。&#128514;

将工厂函数作为实参传入IIFE

```javascript
var a = 2;

(function IIFE( def ){
	def( window );
})(function def( global ){

	var a = 3;
	console.log( a ); // 3
	console.log( global.a ); // 2

});
```

### 匿名函数

JS中经常需要将函数作为参数或返回值，通常会采用匿名函数的做法，比如：

```javascript
setTimeout( function(){
	console.log("I waited 1 second!");
}, 1000 );
```

这样做可以省点时间对函数取名，但是：

1. 匿名函数在函数的调用栈中不明显，可能会导致调试更加困难。
2. 递归调用不太方便（可以使用`arguments.callee`，但是这是将要废弃的API，最好不要用）
3. 取一个有意义的名字可以更快的理解函数中语句的意义。

所以最佳实践是：始终对函数取名。

```javascript
setTimeout( function timeoutHandler(){ // <-- 看！我有名字了
	console.log( "I waited 1 second!" );
}, 1000 );
```

## 块级作用域

恩，我知道你想说什么，JS并没有什么块级作用域。因此对于`if`、`for`之类的，把变量定义在`{}`内，在整个函数作用域依然可以访问到。

但是，JS除了函数作用域，就没有办法产生作用域了么？

显然我这么问，答案就是有的：

### 1. `with`

之前讨论过这个玩意，相当于在当前作用域链的最前端，加上指定的对象，看起来貌似延长了作用域链。还是那句话：尽可能的不要用。

### 2. `try/catch`

在ES3的规定中：`try/catch`会创建`catch`的块级作用域，且传入的参数只存在于该块级作用域。

### 3. `let/const`

这个ES6中的声明变量方式，这样JS就有块级作用域了。就是像其他语言一样，`let/const`声明的变量只在当前的块级作用域下存在


## 总结

- JS中最普遍的作用域是函数作用域，除此之外还有`with`、`try/catch`、`let/const`(ES6新增)带来的块级作用域
- 函数作用域可以用来：隐藏内部实现、避免冲突。
- 可以使用IIFE来更简便的创建函数作用域，并且最好对匿名函数添加函数名。
