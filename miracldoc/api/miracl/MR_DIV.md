# MR_DIV

`MR_DIV`定义在`miracl.h`，返回商。

```c
#ifdef MR_FP
#define MR_DIV(a,b)    (modf((a)/(b),&dres),dres)
#else
#define MR_DIV(a,b)    ((a)/(b))
#endif
```

`modf((a)/(b),&dres)`将浮点数分解为整数部分和小数部分，`(modf((a)/(b),&dres),dres)`为逗号表达式，返回最后一项。

## modf()

[modf](/miracldoc/api/cplus.md)是C语言库`math.h`中提供的函数

```c
extern double modf(double x, double *intptr);
```

函数功能：将浮点数分解为整数部分和小数部分，提取浮点数 x 的整数部分和小数部分，整数部分被存到参数 intptr，小数部分被放入返回值中。

参数`x`：想要分解的浮点数。

参数`intptr`：一个指向`double`类型的指针，用于存储`x`的整数部分（也就是商），符号与`x`相同。


