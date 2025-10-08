# nres_premult

`nres_premult`

```c
extern void  nres_premult(_MIPT_ big,int,big);
```

```c
void nres_premult(_MIPD_ big x,int k,big w)
{ /* multiply n-residue by small ordinary integer */
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    int sign=0;
    if (k==0) 
    {
        zero(w);
        return;
    }
    if (k<0)
    {
        k=-k;
        sign=1;
    }
    if (mr_mip->ERNUM) return;

    MR_IN(102)

    if (k<=6)
    {
        switch (k)
        {
        case 1: copy(x,w);
                break;
        case 2: nres_modadd(_MIPP_ x,x,w);
                break;    
        case 3:
                nres_modadd(_MIPP_ x,x,mr_mip->w0);
                nres_modadd(_MIPP_ x,mr_mip->w0,w);
                break;
        case 4:
                nres_modadd(_MIPP_ x,x,w);
                nres_modadd(_MIPP_ w,w,w);
                break;    
        case 5:
                nres_modadd(_MIPP_ x,x,mr_mip->w0);
                nres_modadd(_MIPP_ mr_mip->w0,mr_mip->w0,mr_mip->w0);
                nres_modadd(_MIPP_ x,mr_mip->w0,w);
                break;
        case 6:
                nres_modadd(_MIPP_ x,x,w);
                nres_modadd(_MIPP_ w,w,mr_mip->w0);
                nres_modadd(_MIPP_ w,mr_mip->w0,w);
                break;
        }
        if (sign==1) nres_negate(_MIPP_ w,w);
        MR_OUT
        return;
    }

    mr_pmul(_MIPP_ x,(mr_small)k,mr_mip->w0);
#ifdef MR_COMBA
#ifdef MR_SPECIAL
	comba_redc(_MIPP_ mr_mip->w0,w);
#else
	divide(_MIPP_ mr_mip->w0,mr_mip->modulus,mr_mip->modulus);
	copy(mr_mip->w0,w);
#endif
#else
    divide(_MIPP_ mr_mip->w0,mr_mip->modulus,mr_mip->modulus);
	copy(mr_mip->w0,w);
#endif 
	
    if (sign==1) nres_negate(_MIPP_ w,w);

    MR_OUT
}
```