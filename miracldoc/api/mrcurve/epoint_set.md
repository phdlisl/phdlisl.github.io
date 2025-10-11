# epoint_set

`epoint_set`定义在`miracl.h`


```c
extern BOOL epoint_set(_MIPT_ big,big,int,epoint*);
```

函数功能：初始化椭圆曲线上的一个点，如果`x`或者`y`为`NULL`，直接设置为无穷点。如果`x==y`，（如果可能的话）计算`y`，根据`cb`确定`y`的`LSB 0/1`；否则忽略`cb`，检验坐标`(x,y)`。

返回值：如果坐标设置成功，返回`TRUE`；否则返回`FALSE`。

参数`_MIPT_`：可能为空，非空为`miracl *`类型。

参数`x`：

参数`y`：

参数`cb`：

参数`p`：

## 源码分析

`epoint_set`实现在`mrcurve.c`

```c
BOOL epoint_set(_MIPD_ big x,big y,int cb,epoint *p)
{ /* initialise a point on active ecurve            *
   * if x or y == NULL, set to point at infinity    *
   * if x==y, a y co-ordinate is calculated - if    *
   * possible - and cb suggests LSB 0/1  of y       *
   * (which "decompresses" y). Otherwise, check     *
   * validity of given (x,y) point, ignoring cb.    *
   * Returns TRUE for valid point, otherwise FALSE. */
  
    BOOL valid;

#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return FALSE;

    // 设置`MIRACL`线程的深度
    MR_IN(97)

    // 只要x或y有一个为空，
    if (x==NULL || y==NULL)
    {
        copy(mr_mip->one,p->X); // 将one复制给X
        zero(p->Y); 
        p->marker=MR_EPOINT_INFINITY; // 状态设置为无穷大
        MR_OUT
        return TRUE;
    }

    valid=FALSE;
	nres(_MIPP_ x,p->X);
	if (x!=y)
	{ /* Check directly that x^2+Ay^2 == x^2.y^2+B */
		nres(_MIPP_ y,p->Y);
		nres_modmult(_MIPP_ p->X,p->X,mr_mip->w1);
		nres_modmult(_MIPP_ p->Y,p->Y,mr_mip->w2);
		nres_modmult(_MIPP_ mr_mip->w1,mr_mip->w2,mr_mip->w3);
		nres_modadd(_MIPP_ mr_mip->w3,mr_mip->B,mr_mip->w3);


		if (mr_abs(mr_mip->Asize)==MR_TOOBIG)
			nres_modmult(_MIPP_ mr_mip->w2,mr_mip->A,mr_mip->w2);
		else
			nres_premult(_MIPP_ mr_mip->w2,mr_mip->Asize,mr_mip->w2);   
		nres_modadd(_MIPP_ mr_mip->w2,mr_mip->w1,mr_mip->w2);
		if (mr_compare(mr_mip->w2,mr_mip->w3)==0) valid=TRUE;
	}
	else
	{ /* find RHS */
		epoint_getrhs(_MIPP_ p->X,mr_mip->w7);
     /* no y supplied - calculate one. Find square root */
#ifndef MR_NOSUPPORT_COMPRESSION
        valid=nres_sqroot(_MIPP_ mr_mip->w7,p->Y);
    /* check LSB - have we got the right root? */
        redc(_MIPP_ p->Y,mr_mip->w1);
        if (remain(_MIPP_ mr_mip->w1,2)!=cb) 
            mr_psub(_MIPP_ mr_mip->modulus,p->Y,p->Y);

#else
		mr_berror(_MIPP_ MR_ERR_NOT_SUPPORTED);
		MR_OUT
		return FALSE;
#endif
    } 
    if (valid)
    {
        p->marker=MR_EPOINT_NORMALIZED;
        MR_OUT
        return TRUE;
    }

    MR_OUT
    return FALSE;
}
```

关于`BOOL`类型的定义和可选值，参考[字符常量](/miracldoc/api/dtype/constants.md)。

[get_mip](/miracldoc/api/mrcore/get_mip.md)返回`miracl *`指针，如果没有定义`MR_OS_THREADS`，由`_MIPD_`接收。

`MR_EPOINT_INFINITY`表示无穷大，其值参考[字符常量](/miracldoc/api/dtype/constants.md)。

[copy](/miracldoc/api/mrcore/copy.md)将x轴坐标复制给y轴坐标。

[MR_IN和MR_OUT](/miracldoc/api/miracl/MR_IN-MR_OUT.md)设置线程的进退码。
