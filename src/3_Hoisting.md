# Hoisting

## 先有鸡还是先有蛋

前面已经讲过了，函数作用域中的变量在函数的任何位置都可以访问到。也就是说鸡（赋值）还没执行，蛋（声明）就可以用了。

举个栗子：

```javascript
foo();
function foo() {
	console.log( a ); // undefined
	var a = 2;
}
```

`a`变量的使用在声明之前，但是并不会抛出错误，而是打印`undefined`。

因为在JS中，函数在执行前会进行预执行（初始化AO、VO），也就是说会对函数作用域下的变量做初始化，将它们统统提升到作用域最顶端。

也就是说，上述代码相当于：

```javascript
// foo 被提前
function foo() {
    // a 被提前
    var a;
	console.log( a ); // undefined
	a = 2;
}

foo();
```

**注意**：只有函数声明会提升，函数表达式并不会。
**注意**：对于带有函数名的函数表达式，函数名只可以在函数体内部使用，不会暴露在父级作用域下。

```javascript
foo(); // TypeError, 因为 foo=undifined
bar(); // ReferenceError, 因为 bar 不存在

var foo = function bar() {
	// ...
};
```

## 函数优先

如果一个函数声明和一个函数表达式使用的是同一个变量名（WTF？！谁TM会这么写代码😅）

```javascript
foo(); // 1
var foo;
function foo() {
	console.log( 1 );
}

foo = function() {
	console.log( 2 );
};
```

JS引擎看到这烂代码之后，一边吐槽一边依然进行变量提升：

```javascript
function foo() {
	console.log( 1 );
}
foo(); // 1
foo = function() {
	console.log( 2 );
};
```

`var foo`不见了，因为它与函数声明存在冲突，所以被忽略了（尽管从位置上来说，`var foo`更靠上）。

那如果这个人又写了烂代码，函数声明重复了呢（无力吐槽🙄）

```javascript
foo(); // 3
function foo() {
	console.log( 1 );
}
var foo = function() {
	console.log( 2 );
};
function foo() {
	console.log( 3 );
}
```

这次由于foo都是函数声明，优先级相同，所以依靠先后顺序一决胜负。变量提升之后：

```javascript
function foo() {
	console.log( 3 );
}
foo(); // 3
foo = function() {
	console.log( 2 );
};
```

## 总结

JS函数在执行前，会进行预执行，对作用域内的变量提升至最顶端，并进行初始化。但是变量的赋值依然在原来的位置。

如果变量定义存在冲突，注意它们的优先级。
