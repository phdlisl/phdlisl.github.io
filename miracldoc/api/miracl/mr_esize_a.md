# mr_esize_a()

`mr_esize_a`定义在`miracl.h`

```c
#define mr_esize_a(n) (((sizeof(epoint)+mr_big_reserve(2,(n)))-1)/MR_SL+1)*MR_SL 
```

函数功能：返回字节数。计算得到的字节数 `((sizeof(epoint)+mr_big_reserve)-1)/sizeof(long)+1)*sizeof(long)`

参数`n`：整数。


## 源码分析


与实现`mr_esize_a`相关的定义和函数如下。

```c
/* Elliptic Curve epoint structure. Uses projective (X,Y,Z) co-ordinates */
typedef struct {
int marker;
big X;
big Y;
#ifndef MR_AFFINE_ONLY
big Z;
#endif
} epoint;
#ifdef MR_FP
  typedef mr_utype mr_small;
  #ifdef mr_dltype
  typedef mr_dltype mr_large;
  #endif
struct bigtype{
    mr_lentype len;
    mr_small *w;
}; 
#define MR_SL sizeof(long)
```

[mr_big_reserve](/miracldoc/api/miracl/mr_big_reserve.md)计算得到`(n)*mr_size(m)+sizeof(long)`个字节。
