# epoint_init_mem_variable

`epoint_init_mem_variable`函数定义在`miracl.h`，在`mrcore.c`中实现。

```c
extern epoint* epoint_init_mem_variable(_MIPT_ char *,int,int);
```

函数功能：用字符数组`mem`初始化一个epoint指针，也就是椭圆曲线的一个点。

参数`mem`：字符数组。

参数`index`：下标。

参数`sz`：整数。

## 源码分析

与`epoint_init_mem_variable`相关的函数如下。

```c
#ifdef MR_GENERIC_MT
#define _MIPD_  miracl *mr_mip,
#else
#define _MIPD_     
#endif

/* Elliptic curve point status */
#define MR_AFFINE     1
#define MR_EPOINT_INFINITY   2

epoint* epoint_init_mem_variable(_MIPD_ char *mem,int index,int sz)
{
    epoint *p;
    char *ptr;
    int offset,r;

#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    // 字节对齐
    offset=0;
    r=(unsigned long)mem%MR_SL;
    if (r>0) offset=MR_SL-r;

#ifndef MR_AFFINE_ONLY
    if (mr_mip->coord==MR_AFFINE)
        p=(epoint *)&mem[offset+index*mr_esize_a(sz)];
    else
#endif
    // 取mem的第offset+index*mr_esize(sz)个元素的地址，然后强制转换为epoint类型指针
    p=(epoint *)&mem[offset+index*mr_esize(sz)];

    ptr=(char *)p+sizeof(epoint);
    p->X=mirvar_mem_variable(ptr,0,sz);
    p->Y=mirvar_mem_variable(ptr,1,sz);
#ifndef MR_AFFINE_ONLY
    if (mr_mip->coord!=MR_AFFINE) p->Z=mirvar_mem_variable(ptr,2,sz);
#endif
    p->marker=MR_EPOINT_INFINITY;
    return p;
}
```

如果定义了`MR_OS_THREADS`，则设置`mr_mip`为[get_mip](/miracldoc/api/mrcore/get_mip.md)，返回`miracl *`指针。

[mirvar_mem_variable](/miracldoc/api/mrcore/mirvar_mem_variable.md)为字符数组`mem`的元素设置对齐。

`MR_AFFINE`和`MR_EPOINT_INFINITY`定义在[字符常量](/miracldoc/api/dtype/constants.md)，表示椭圆曲线上点的状态。

