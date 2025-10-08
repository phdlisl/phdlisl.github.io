# mputs

`mputs`定义和实现都在`mrcore.h`


```c
#ifndef MR_NO_STANDARD_IO

static void mputs(char *s)
{ /* output a string */
    int i=0;
    while (s[i]!=0) fputc((int)s[i++],stdout);
}
#endif
```

函数功能：在屏幕打印字符串，其中字符强制转换为整形，也就是打印字符的ASCII码。

参数`s`：字符串。


