# mr_ecp_reserve_a

`mr_ecp_reserve_a`定义在`miracl.h`

```c
#define mr_ecp_reserve_a(n,m) ((n)*mr_esize_a(m)+MR_SL)
```

函数功能：返回字节数。

参数`n`：整数。

参数`m`：整数。

函数实现中用[mr_esize_a](/parts/api/miracl/mr_esize_a.md)计算字节数。