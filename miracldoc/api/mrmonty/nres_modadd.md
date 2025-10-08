# nres_modadd

`nres_modadd`

```c
extern void  nres_modadd(_MIPT_ big,big,big); 
```

```c
void nres_modadd(_MIPD_ big x,big y,big w)
{ /* modular addition */
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
#ifdef MR_COUNT_OPS
fpa++; 
#endif
#ifdef MR_COMBA

    if (mr_mip->ACTIVE)
    {
        comba_modadd(_MIPP_ x,y,w);
        return;
    }
    else
    {
#endif
        if (mr_mip->ERNUM) return;

        MR_IN(90)
        mr_padd(_MIPP_ x,y,w);
        if (mr_compare(w,mr_mip->modulus)>=0) mr_psub(_MIPP_ w,mr_mip->modulus,w);

        MR_OUT
#ifdef MR_COMBA
    }
#endif
}
```