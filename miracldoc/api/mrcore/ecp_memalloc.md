# ecp_memalloc

`ecp_memalloc`函数定义在`miracl.h`，在`mrcore.c`中实现。

```c
extern void* ecp_memalloc(_MIPT_ int);
```

函数功能：为epoint分配堆内存。

参数`num`：整数。

## 源码分析

`ecp_memalloc`函数实现的相关内容如下。

```c
void *ecp_memalloc(_MIPD_ int num)
{
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif

#ifndef MR_AFFINE_ONLY
    if (mr_mip->coord==MR_AFFINE)
        return mr_alloc(_MIPP_  mr_ecp_reserve_a(num,mr_mip->nib-1),1);
    else
#endif
        return mr_alloc(_MIPP_  mr_ecp_reserve(num,mr_mip->nib-1),1);
}
```

[get_mip](/parts/api/mrcore/get_mip.md)返回`miracl *`指针，如果没有定义`MR_OS_THREADS`，由`_MIPD_`接收。

一般情况下，用[mr_ecp_reserve](/parts/api/miracl/mr_ecp_reserve.md)计算需要申请的字节数，当声明`MR_AFFINE_ONLY`，用[mr_ecp_reserve_a](/parts/api/miracl/mr_ecp_reserve_a.md)计算需要申请的字节数。

