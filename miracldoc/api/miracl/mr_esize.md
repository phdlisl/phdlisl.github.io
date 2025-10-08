# mr_esize

`mr_esize`定义在`miracl.h`

如果定义了`MR_AFFINE_ONLY`，

```c
#ifdef MR_AFFINE_ONLY
#define mr_esize(n) (((sizeof(epoint)+mr_big_reserve(2,(n)))-1)/MR_SL+1)*MR_SL 
#else
#define mr_esize(n) (((sizeof(epoint)+mr_big_reserve(3,(n)))-1)/MR_SL+1)*MR_SL 
#endif
```

函数功能：返回字节数。计算得到的字节数 `((sizeof(epoint)+mr_big_reserve)-1)/sizeof(long)+1)*sizeof(long)`

参数`n`：整数。

## 源码分析

与实现`mr_esize`相关的定义和函数如下。

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
// 计算所需字节数
#define mr_size(n) (((sizeof(struct bigtype)+((n)+2)*sizeof(mr_utype))-1)/MR_SL+1)*MR_SL
#define mr_big_reserve(n,m) ((n)*mr_size(m)+MR_SL)
#ifdef MR_AFFINE_ONLY
#define mr_esize(n) (((sizeof(epoint)+mr_big_reserve(2,(n)))-1)/MR_SL+1)*MR_SL 
#else
#define mr_esize(n) (((sizeof(epoint)+mr_big_reserve(3,(n)))-1)/MR_SL+1)*MR_SL 
#endif
```

[mr_size](/parts/api/miracl/mr_size.md)计算返回字节数。

[mr_big_reserve](/parts/api/miracl/mr_big_reserve.md)计算得到`(n)*mr_size(m)+sizeof(long)`个字节。

