# ecurve_padd

`ecurve_padd`

```c
static BOOL ecurve_padd(_MIPD_ epoint *p,epoint *pa)
{ /* primitive add two epoints on the active ecurve - pa+=p;   *
   * note that if p is normalized, its Z coordinate isn't used */
 
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
#ifndef MR_AFFINE_ONLY
    if (mr_mip->coord==MR_AFFINE)
    {  /* 1 sqr, 1 mul, 1 div */
#endif
        nres_modsub(_MIPP_ p->Y,pa->Y,mr_mip->w8);
        nres_modsub(_MIPP_ p->X,pa->X,mr_mip->w6);
        if (size(mr_mip->w6)==0) 
        { /* divide by 0 */
            if (size(mr_mip->w8)==0) 
            { /* should have doubled ! */
                return FALSE; 
            }
            else
            { /* point at infinity */
                epoint_set(_MIPP_ NULL,NULL,0,pa);
                return TRUE;
            }
        }
        if (nres_moddiv(_MIPP_ mr_mip->w8,mr_mip->w6,mr_mip->w8)>1)
        {
            epoint_set(_MIPP_ NULL,NULL,0,pa);
            mr_berror(_MIPP_ MR_ERR_COMPOSITE_MODULUS);
            return TRUE;
        }

        nres_modmult(_MIPP_ mr_mip->w8,mr_mip->w8,mr_mip->w2); /* w2=m^2 */
        nres_modsub(_MIPP_ mr_mip->w2,p->X,mr_mip->w1); /* w1=m^2-x1-x2 */
        nres_modsub(_MIPP_ mr_mip->w1,pa->X,mr_mip->w1);
        

        nres_modsub(_MIPP_ pa->X,mr_mip->w1,mr_mip->w2);
        nres_modmult(_MIPP_ mr_mip->w2,mr_mip->w8,mr_mip->w2);
        nres_modsub(_MIPP_ mr_mip->w2,pa->Y,pa->Y);
        copy(mr_mip->w1,pa->X);

        pa->marker=MR_EPOINT_NORMALIZED;
        return TRUE;
#ifndef MR_AFFINE_ONLY
    }

    if (p->marker!=MR_EPOINT_NORMALIZED)    
    {
        nres_modmult(_MIPP_ p->Z,p->Z,mr_mip->w6);
        nres_modmult(_MIPP_ pa->X,mr_mip->w6,mr_mip->w1);
        nres_modmult(_MIPP_ mr_mip->w6,p->Z,mr_mip->w6);
        nres_modmult(_MIPP_ pa->Y,mr_mip->w6,mr_mip->w8);
    }
    else
    {
        copy(pa->X,mr_mip->w1);
        copy(pa->Y,mr_mip->w8);
    }
    if (pa->marker==MR_EPOINT_NORMALIZED)
        copy(mr_mip->one,mr_mip->w6);
    else nres_modmult(_MIPP_ pa->Z,pa->Z,mr_mip->w6);

    nres_modmult(_MIPP_ p->X,mr_mip->w6,mr_mip->w4);
    if (pa->marker!=MR_EPOINT_NORMALIZED) 
        nres_modmult(_MIPP_ mr_mip->w6,pa->Z,mr_mip->w6);
    nres_modmult(_MIPP_ p->Y,mr_mip->w6,mr_mip->w5);
    nres_modsub(_MIPP_ mr_mip->w1,mr_mip->w4,mr_mip->w1);
    nres_modsub(_MIPP_ mr_mip->w8,mr_mip->w5,mr_mip->w8);

/* w8 contains the numerator of the slope */

    if (size(mr_mip->w1)==0)
    {
        if (size(mr_mip->w8)==0)
        { /* should have doubled ! */
           return FALSE; 
        }
        else
        { /* point at infinity */
            epoint_set(_MIPP_ NULL,NULL,0,pa);
            return TRUE;
        }
    }
    nres_modadd(_MIPP_ mr_mip->w4,mr_mip->w4,mr_mip->w6);
    nres_modadd(_MIPP_ mr_mip->w1,mr_mip->w6,mr_mip->w4);
    nres_modadd(_MIPP_ mr_mip->w5,mr_mip->w5,mr_mip->w6);
    nres_modadd(_MIPP_ mr_mip->w8,mr_mip->w6,mr_mip->w5);
    
    if (p->marker!=MR_EPOINT_NORMALIZED)
    { 
        if (pa->marker!=MR_EPOINT_NORMALIZED) 
            nres_modmult(_MIPP_ pa->Z,p->Z,mr_mip->w3);
        else
            copy(p->Z,mr_mip->w3);
        nres_modmult(_MIPP_ mr_mip->w3,mr_mip->w1,pa->Z);
    }
    else
    {
        if (pa->marker!=MR_EPOINT_NORMALIZED)
            nres_modmult(_MIPP_ pa->Z,mr_mip->w1,pa->Z);
        else
            copy(mr_mip->w1,pa->Z);
    }
    nres_modmult(_MIPP_ mr_mip->w1,mr_mip->w1,mr_mip->w6);
    nres_modmult(_MIPP_ mr_mip->w1,mr_mip->w6,mr_mip->w1);
    nres_modmult(_MIPP_ mr_mip->w6,mr_mip->w4,mr_mip->w6);
    nres_modmult(_MIPP_ mr_mip->w8,mr_mip->w8,mr_mip->w4);

    nres_modsub(_MIPP_ mr_mip->w4,mr_mip->w6,pa->X);
    nres_modsub(_MIPP_ mr_mip->w6,pa->X,mr_mip->w6);
    nres_modsub(_MIPP_ mr_mip->w6,pa->X,mr_mip->w6);
    nres_modmult(_MIPP_ mr_mip->w8,mr_mip->w6,mr_mip->w2);
    nres_modmult(_MIPP_ mr_mip->w1,mr_mip->w5,mr_mip->w1);
    nres_modsub(_MIPP_ mr_mip->w2,mr_mip->w1,mr_mip->w5);

/* divide by 2 */

    nres_div2(_MIPP_ mr_mip->w5,pa->Y);

    pa->marker=MR_EPOINT_GENERAL;
    return TRUE;      
#endif
}
```