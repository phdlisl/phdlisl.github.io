# mr_size

`mr_size`定义在`miracl.h`


```c
#define mr_size(n) (((sizeof(struct bigtype)+((n)+2)*sizeof(mr_utype))-1)/MR_SL+1)*MR_SL
```

函数功能：返回字节数。若`struct bigtype`类型数据占8个字节，`long`类型数据占8个字节，则总共申请$$(((8+(n+2)*4)-1)/8+1)*8=15+4n+8$$个字节。

参数`n`：整型变量。

## 函数分析

为实现`mr_size`，所需要的相关数据类型定义如下。

```c
#define mr_utype int /* the underlying type is usually int, but see mrmuldv.any */
#ifdef MR_FP
  typedef mr_utype mr_small;
#else
  typedef unsigned mr_utype mr_small;

/* It might be wanted to change this to unsigned long */

typedef unsigned int mr_lentype;

struct bigtype
{
    mr_lentype len;
    mr_small *w;
};

typedef struct bigtype *big;
#define MR_SL sizeof(long)
```

`mr_utype`在`mirdef.h`定义，一般定义为`int`。

`mr_small`定义为`mr_utype`或者`unsigned mr_utype`，根据`mr_utype`的定义，一般为`int`或者`unsigned int`。

`struct bigtype`类型由`mr_lentype`和`mr_small`类型数据成员，一般情况下与下面的定义等价。`big`是`struct bigtype *`的别名。

```c
struct bigtype
{
    unsigned int len;
    int *w;
};
```

`MR_SL`在`miracl.h`定义，计算`long`类型数据占用内存字节数。

