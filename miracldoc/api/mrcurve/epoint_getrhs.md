# epoint_getrhs

`epoint_getrhs`

```c
#ifndef MR_EDWARDS

static void epoint_getrhs(_MIPD_ big x,big y)
{ /* x and y must be different */

  /* find x^3+Ax+B */
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    nres_modmult(_MIPP_ x,x,y);

    nres_modmult(_MIPP_ y,x,y);
    if (mr_abs(mr_mip->Asize)==MR_TOOBIG)
        nres_modmult(_MIPP_ x,mr_mip->A,mr_mip->w1);
    else
        nres_premult(_MIPP_ x,mr_mip->Asize,mr_mip->w1);
    nres_modadd(_MIPP_ y,mr_mip->w1,y);
    if (mr_abs(mr_mip->Bsize)==MR_TOOBIG)
        nres_modadd(_MIPP_ y,mr_mip->B,y);
    else
    {
        convert(_MIPP_ mr_mip->Bsize,mr_mip->w1);
        nres(_MIPP_ mr_mip->w1,mr_mip->w1);
        nres_modadd(_MIPP_ y,mr_mip->w1,y);
    }
}
#else

/*   Twisted Inverted Edwards curves 

 *   Assumes Twisted Inverted Edward's equation x^2+Ay^2 = x^2.y^2 + B
 *   Assumes points are not of order 2 or 4
*/

static void epoint_getrhs(_MIPD_ big x,big y)
{ 
  /* find RHS=(x^2-B)/(x^2-A) */
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
 
    nres_modmult(_MIPP_ x,x,mr_mip->w6);
    nres_modsub(_MIPP_ mr_mip->w6,mr_mip->B,y);  
    nres_modsub(_MIPP_ mr_mip->w6,mr_mip->A,mr_mip->w6);

    nres_moddiv(_MIPP_ y,mr_mip->w6,y);
}
#endif
