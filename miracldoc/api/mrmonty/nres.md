# nres

`nres`定义在`miracl.h`

```c
extern void  nres(_MIPT_ big,big);
```

函数功能：

参数`_MIPD_`：可能为空，非空为`miracl *`类型。

参数`x`：

参数`y`：


## 源码分析

`nres`实现在`mrmonty.c`


```c
void nres(_MIPD_ big x,big y)
{ /* convert x to n-residue format */
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip(); // 返回`miracl *`实例
#endif
    if (mr_mip->ERNUM) return; // 有错误直接返回

    MR_IN(81) // 线程进入码

    if (size(mr_mip->modulus)==0)
    {
        mr_berror(_MIPP_ MR_ERR_NO_MODULUS);
        MR_OUT  // 线程退出码
        return;
    }
    copy(x,y); // 将x轴坐标复制给y轴坐标。
    divide(_MIPP_ y,mr_mip->modulus,mr_mip->modulus);
    if (size(y)<0) add(_MIPP_ y,mr_mip->modulus,y);
    if (!mr_mip->MONTY) 
    {
        MR_OUT
        return;
    }
    mr_mip->check=OFF;

    mr_shift(_MIPP_ y,(int)mr_mip->modulus->len,mr_mip->w0);
    divide(_MIPP_ mr_mip->w0,mr_mip->modulus,mr_mip->modulus);
    mr_mip->check=ON;
    copy(mr_mip->w0,y);

    MR_OUT
}
```

[miracl类型](/parts/api/dtype/miracl.md)

[get_mip](/parts/api/mrcore/get_mip.md)返回`miracl *`指针，如果没有定义`MR_OS_THREADS`，由`_MIPD_`接收。

[ERNUM](/parts/api/dtype/miracl.md)错误码，如果非零，表示有错误。

[MR_IN](/parts/api/miracl/MR_IN-MR_OUT.md)设置线程的进入码，[MR_OUT](/parts/api/miracl/MR_IN-MR_OUT.md)设置线程的退出码。

[mr_berror](/parts/api/mrcore/mr_berror.md)的错误码为[MR_ERR_NO_MODULUS](/parts/api/dtype/constants.md)。

[copy](/parts/api/mrcore/copy.md)将x轴坐标复制给y轴坐标。
