# ecurve_double

`ecurve_double`定义在`miracl.h`

```c
extern void ecurve_double(_MIPT_ epoint*);
```

函数功能：

参数`_MIPD_`：可能为空，非空为`miracl *`类型。

参数`p`：椭圆曲线上的点。

## 源码分析



```c
void ecurve_double(_MIPD_ epoint *p)
{ /* double epoint on active ecurve */

#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return;

    // 如果是无穷远点，直接返回
    if (p->marker==MR_EPOINT_INFINITY) 
    { /* 2 times infinity == infinity ! */
        return;
    }

#ifndef MR_AFFINE_ONLY
    if (mr_mip->coord==MR_AFFINE)
    { /* 2 sqrs, 1 mul, 1 div */
#endif
        if (size(p->Y)==0) 
        { /* set to point at infinity */
            epoint_set(_MIPP_ NULL,NULL,0,p);
            return;
        }
 
        nres_modmult(_MIPP_ p->X,p->X,mr_mip->w8);    /* w8=x^2   */
        nres_premult(_MIPP_ mr_mip->w8,3,mr_mip->w8); /* w8=3*x^2 */
        if (mr_abs(mr_mip->Asize) == MR_TOOBIG)
            nres_modadd(_MIPP_ mr_mip->w8,mr_mip->A,mr_mip->w8);
        else
        {
            convert(_MIPP_ mr_mip->Asize,mr_mip->w2);
            nres(_MIPP_ mr_mip->w2,mr_mip->w2);
            nres_modadd(_MIPP_ mr_mip->w8,mr_mip->w2,mr_mip->w8);
        }                                     /* w8=3*x^2+A */
        nres_premult(_MIPP_ p->Y,2,mr_mip->w6);      /* w6=2y */
        if (nres_moddiv(_MIPP_ mr_mip->w8,mr_mip->w6,mr_mip->w8)>1) 
        {
            epoint_set(_MIPP_ NULL,NULL,0,p);
            mr_berror(_MIPP_ MR_ERR_COMPOSITE_MODULUS); 
            return;
        }

/* w8 is slope m on exit */

        nres_modmult(_MIPP_ mr_mip->w8,mr_mip->w8,mr_mip->w2); /* w2=m^2 */
        nres_premult(_MIPP_ p->X,2,mr_mip->w1);
        nres_modsub(_MIPP_ mr_mip->w2,mr_mip->w1,mr_mip->w1); /* w1=m^2-2x */
        
        nres_modsub(_MIPP_ p->X,mr_mip->w1,mr_mip->w2);
        nres_modmult(_MIPP_ mr_mip->w2,mr_mip->w8,mr_mip->w2);
        nres_modsub(_MIPP_ mr_mip->w2,p->Y,p->Y);
        copy(mr_mip->w1,p->X);
        
        return;    
#ifndef MR_AFFINE_ONLY
    }

    if (size(p->Y)==0) // 如果Y转换后等于0，设置为无穷远点
    { /* set to point at infinity */
        epoint_set(_MIPP_ NULL,NULL,0,p);
        return;
    }
 
    convert(_MIPP_ 1,mr_mip->w1); // 将1转换为`big`类型数据。
    if (mr_abs(mr_mip->Asize) < MR_TOOBIG)
    {
        if (mr_mip->Asize!=0)
        {
            if (p->marker==MR_EPOINT_NORMALIZED)
				nres(_MIPP_ mr_mip->w1,mr_mip->w6);
            else nres_modmult(_MIPP_ p->Z,p->Z,mr_mip->w6);
        }

        if (mr_mip->Asize==(-3))
        { /* a is -3. Goody. 4 sqrs, 4 muls */
            nres_modsub(_MIPP_ p->X,mr_mip->w6,mr_mip->w3);
            nres_modadd(_MIPP_ p->X,mr_mip->w6,mr_mip->w8);
            nres_modmult(_MIPP_ mr_mip->w3,mr_mip->w8,mr_mip->w3);
            nres_modadd(_MIPP_ mr_mip->w3,mr_mip->w3,mr_mip->w8);
            nres_modadd(_MIPP_ mr_mip->w8,mr_mip->w3,mr_mip->w8);
        }
        else
        { /* a is small */
            if (mr_mip->Asize!=0)
            { /* a is non zero! */
                nres_modmult(_MIPP_ mr_mip->w6,mr_mip->w6,mr_mip->w3);
                nres_premult(_MIPP_ mr_mip->w3,mr_mip->Asize,mr_mip->w3);
            }
            nres_modmult(_MIPP_ p->X,p->X,mr_mip->w1);
            nres_modadd(_MIPP_ mr_mip->w1,mr_mip->w1,mr_mip->w8);
            nres_modadd(_MIPP_ mr_mip->w8,mr_mip->w1,mr_mip->w8);
            if (mr_mip->Asize!=0) nres_modadd(_MIPP_ mr_mip->w8,mr_mip->w3,mr_mip->w8);
        }
    }
    else
    { /* a is not special */
        if (p->marker==MR_EPOINT_NORMALIZED) nres(_MIPP_ mr_mip->w1,mr_mip->w6);
        else nres_modmult(_MIPP_ p->Z,p->Z,mr_mip->w6);

        nres_modmult(_MIPP_ mr_mip->w6,mr_mip->w6,mr_mip->w3);
        nres_modmult(_MIPP_ mr_mip->w3,mr_mip->A,mr_mip->w3);
        nres_modmult(_MIPP_ p->X,p->X,mr_mip->w1);
        nres_modadd(_MIPP_ mr_mip->w1,mr_mip->w1,mr_mip->w8);
        nres_modadd(_MIPP_ mr_mip->w8,mr_mip->w1,mr_mip->w8);
        nres_modadd(_MIPP_ mr_mip->w8,mr_mip->w3,mr_mip->w8);        
    }

/* w8 contains numerator of slope 3x^2+A.z^4  *
 * denominator is now placed in Z             */

    nres_modmult(_MIPP_ p->Y,p->Y,mr_mip->w2);
    nres_modmult(_MIPP_ p->X,mr_mip->w2,mr_mip->w3);
    nres_modadd(_MIPP_ mr_mip->w3,mr_mip->w3,mr_mip->w3);
    nres_modadd(_MIPP_ mr_mip->w3,mr_mip->w3,mr_mip->w3);
    nres_modmult(_MIPP_ mr_mip->w8,mr_mip->w8,p->X);
    nres_modsub(_MIPP_ p->X,mr_mip->w3,p->X);
    nres_modsub(_MIPP_ p->X,mr_mip->w3,p->X);
    
    if (p->marker==MR_EPOINT_NORMALIZED)
        copy(p->Y,p->Z);
    else nres_modmult(_MIPP_ p->Z,p->Y,p->Z);
    nres_modadd(_MIPP_ p->Z,p->Z,p->Z);

    nres_modadd(_MIPP_ mr_mip->w2,mr_mip->w2,mr_mip->w7);
    nres_modmult(_MIPP_ mr_mip->w7,mr_mip->w7,mr_mip->w2);
    nres_modadd(_MIPP_ mr_mip->w2,mr_mip->w2,mr_mip->w2);
    nres_modsub(_MIPP_ mr_mip->w3,p->X,mr_mip->w3);
    nres_modmult(_MIPP_ mr_mip->w8,mr_mip->w3,p->Y);
    nres_modsub(_MIPP_ p->Y,mr_mip->w2,p->Y);

/* alternative method
    nres_modadd(_MIPP_ p->Y,p->Y,mr_mip->w2);  

    if (p->marker==MR_EPOINT_NORMALIZED)
        copy(mr_mip->w2,p->Z);

    else nres_modmult(_MIPP_ mr_mip->w2,p->Z,p->Z);

    nres_modmult(_MIPP_ mr_mip->w2,mr_mip->w2,mr_mip->w2); 
    nres_modmult(_MIPP_ p->X,mr_mip->w2,mr_mip->w3);
    nres_modadd(_MIPP_ mr_mip->w3,mr_mip->w3,p->X);
    nres_modmult(_MIPP_ mr_mip->w8,mr_mip->w8,mr_mip->w1);
    nres_modsub(_MIPP_ mr_mip->w1,p->X,p->X);
    nres_modmult(_MIPP_ mr_mip->w2,mr_mip->w2,mr_mip->w2);

    if (remain(_MIPP_ mr_mip->w2,2)!=0)
        mr_padd(_MIPP_ mr_mip->w2,mr_mip->modulus,mr_mip->w2);
    subdiv(_MIPP_ mr_mip->w2,2,mr_mip->w2);

    nres_modsub(_MIPP_ mr_mip->w3,p->X,mr_mip->w3);
    nres_modmult(_MIPP_ mr_mip->w3,mr_mip->w8,mr_mip->w3);
    nres_modsub(_MIPP_ mr_mip->w3,mr_mip->w2,p->Y);
*/

/* 

Observe that when finished w8 contains the line slope, w7 has 2y^2 and w6 has z^2 
This is useful for calculating line functions in pairings  

*/

    p->marker=MR_EPOINT_GENERAL;
    return;
#endif
}
```

[size](/parts/api/mrcore/size.md)

[convert](/parts/api/mrcore/convert.md)将有符号`int`类型数据转换为`big`类型数据。

[nres_modmult](/parts/api/mrmonty/nres_modmult.md)


