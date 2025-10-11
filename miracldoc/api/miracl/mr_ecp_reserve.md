# mr_ecp_reserve()

`mr_ecp_reserve`函数定义在`miracl.h`。

```c
#define mr_ecp_reserve(n,m) ((n)*mr_esize(m)+MR_SL)
```

函数功能：返回字节数。计算得到`(n)*mr_esize(m)+sizeof(long)`个字符。

参数`n`：整数。

参数`m`：整数。


函数实现中，用到[mr_esize](/miracldoc/api/miracl/mr_esize.md)。