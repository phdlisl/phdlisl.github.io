# mr_big_reserve

`mr_big_reserve`定义在`miracl.h`

```c
/* useful macro to convert size of big in words, to size of required structure */

#define mr_big_reserve(n,m) ((n)*mr_size(m)+MR_SL)
```

函数功能：计算得到`(n)*mr_size(m)+sizeof(long)`个字节。

参数`n`：整数。

参数`m`：整数。

`MR_SL`为`long`类型数据占用的字节数，[mr_size](/parts/api/miracl/mr_size.md)计算返回字节数。

```c
#define MR_SL sizeof(long)
```

