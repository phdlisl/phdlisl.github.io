# epoint_init_mem

`epoint_init_mem`函数定义在`miracl.h`，在`mrcore.c`中实现。

```c
extern epoint* epoint_init_mem(_MIPT_ char *,int);
```

函数功能：将字符串`mem`初始化为椭圆曲线上的点。

参数`_MIPT_`：可能为空，非空为`miracl *`类型。

参数`mem`：字符串。

参数`index`：整数。

## 源码分析

`epoint_init_mem`相关的内容如下。

```c
epoint* epoint_init_mem(_MIPD_ char *mem,int index)
{ 
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return NULL;

    return epoint_init_mem_variable(_MIPP_ mem,index,mr_mip->nib-1);
}
```

[get_mip](/parts/api/mrcore/get_mip.md)返回`miracl *`指针，如果没有定义`MR_OS_THREADS`，由`_MIPD_`接收。

[epoint_init_mem_variable](/parts/api/mrcore/epoint_init_mem_variable.md)对`mem`初始化为椭圆曲线上的点。