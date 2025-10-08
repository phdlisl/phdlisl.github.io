# nres_sqroot

`nres_sqroot`

```c
extern BOOL  nres_sqroot(_MIPT_ big,big);
```

```c
BOOL nres_sqroot(_MIPD_ big x,big w)
{ /* w=sqrt(x) mod p. This depends on p being prime! */
    int t,js;
   
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return FALSE;

    copy(x,w);
    if (size(w)==0) return TRUE; 

    MR_IN(100)

    redc(_MIPP_ w,w);   /* get it back into normal form */

    if (size(w)==1) /* square root of 1 is 1 */
    {
        nres(_MIPP_ w,w);
        MR_OUT
        return TRUE;
    }

    if (size(w)==4) /* square root of 4 is 2 */
    {
        convert(_MIPP_ 2,w);
        nres(_MIPP_ w,w);
        MR_OUT
        return TRUE;
    }

    if (jack(_MIPP_ w,mr_mip->modulus)!=1) 
    { /* Jacobi test */ 
        zero(w);
        MR_OUT
        return FALSE;
    }

    js=mr_mip->pmod8%4-2;     /* 1 mod 4 or 3 mod 4 prime? */

    incr(_MIPP_ mr_mip->modulus,js,mr_mip->w10);
    subdiv(_MIPP_ mr_mip->w10,4,mr_mip->w10);    /* (p+/-1)/4 */

    if (js==1)
    { /* 3 mod 4 primes - do a quick and dirty sqrt(x)=x^(p+1)/4 mod p */
        nres(_MIPP_ w,mr_mip->w2);
        copy(mr_mip->one,w);
        forever
        { /* Simple Right-to-Left exponentiation */

            if (mr_mip->user!=NULL) (*mr_mip->user)();
            if (subdiv(_MIPP_ mr_mip->w10,2,mr_mip->w10)!=0)
                nres_modmult(_MIPP_ w,mr_mip->w2,w);
            if (mr_mip->ERNUM || size(mr_mip->w10)==0) break;
            nres_modmult(_MIPP_ mr_mip->w2,mr_mip->w2,mr_mip->w2);
        }
 
 /*     nres_moddiv(_MIPP_ mr_mip->one,w,mr_mip->w11); 
        nres_modadd(_MIPP_ mr_mip->w11,w,mr_mip->w3);  
        nres_lucas(_MIPP_ mr_mip->w3,mr_mip->w10,w,w);
        nres_modadd(_MIPP_ mr_mip->w11,mr_mip->one,mr_mip->w11); 
        nres_moddiv(_MIPP_ w,mr_mip->w11,w); */
    } 
    else
    { /* 1 mod 4 primes */
        for (t=1; ;t++)
        { /* t=1.5 on average */
            if (t==1) copy(w,mr_mip->w4);
            else
            {
                premult(_MIPP_ w,t,mr_mip->w4);
                divide(_MIPP_ mr_mip->w4,mr_mip->modulus,mr_mip->modulus);
                premult(_MIPP_ mr_mip->w4,t,mr_mip->w4);
                divide(_MIPP_ mr_mip->w4,mr_mip->modulus,mr_mip->modulus);
            }

            decr(_MIPP_ mr_mip->w4,4,mr_mip->w1);
            if (jack(_MIPP_ mr_mip->w1,mr_mip->modulus)==js) break;
            if (mr_mip->ERNUM) break;
        }
    
        decr(_MIPP_ mr_mip->w4,2,mr_mip->w3);
        nres(_MIPP_ mr_mip->w3,mr_mip->w3);
        nres_lucas(_MIPP_ mr_mip->w3,mr_mip->w10,w,w); /* heavy lifting done here */
        if (t!=1)
        {
            convert(_MIPP_ t,mr_mip->w11);
            nres(_MIPP_ mr_mip->w11,mr_mip->w11);
            nres_moddiv(_MIPP_ w,mr_mip->w11,w);
        }
    }
    
    MR_OUT
    return TRUE;
}
```