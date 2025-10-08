# ecurve_mult

```c
extern int  ecurve_mult(_MIPT_ big,epoint *,epoint *);
```

```c
int ecurve_mult(_MIPD_ big e,epoint *pa,epoint *pt)
{ /* pt=e*pa; */
    int i,j,n,nb,nbs,nzs,nadds;
    epoint *table[MR_ECC_STORE_N];
#ifndef MR_AFFINE_ONLY
    big work[MR_ECC_STORE_N];
#endif

#ifdef MR_STATIC
    char mem[MR_ECP_RESERVE(MR_ECC_STORE_N)];  
#ifndef MR_AFFINE_ONLY
    char mem1[MR_BIG_RESERVE(MR_ECC_STORE_N)];
#endif
#else
    char *mem;
#ifndef MR_AFFINE_ONLY
    char *mem1;
#endif
#endif

#ifndef MR_ALWAYS_BINARY
    epoint *p;
    int ce,ch;
#endif
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return 0;

    MR_IN(95)
    if (size(e)==0) 
    { /* multiplied by 0 */
        epoint_set(_MIPP_ NULL,NULL,0,pt);
        MR_OUT
        return 0;
    }
    copy(e,mr_mip->w9);
/*    epoint_norm(_MIPP_ pa); */
    epoint_copy(pa,pt);

    if (size(mr_mip->w9)<0)
    { /* pt = -pt */
        negify(mr_mip->w9,mr_mip->w9);
        epoint_negate(_MIPP_ pt);
    }

    if (size(mr_mip->w9)==1)
    { 
        MR_OUT
        return 0;
    }

    premult(_MIPP_ mr_mip->w9,3,mr_mip->w10);      /* h=3*e */

#ifndef MR_STATIC
#ifndef MR_ALWAYS_BINARY
    if (mr_mip->base==mr_mip->base2)
    {
#endif
#endif

#ifdef  MR_STATIC
        memset(mem,0,MR_ECP_RESERVE(MR_ECC_STORE_N));
#ifndef MR_AFFINE_ONLY
        memset(mem1,0,MR_BIG_RESERVE(MR_ECC_STORE_N));
#endif
#else
        mem=(char *)ecp_memalloc(_MIPP_ MR_ECC_STORE_N);
#ifndef MR_AFFINE_ONLY
        mem1=(char *)memalloc(_MIPP_ MR_ECC_STORE_N);
#endif
#endif

        for (i=0;i<=MR_ECC_STORE_N-1;i++)
        {
            table[i]=epoint_init_mem(_MIPP_ mem,i);
#ifndef MR_AFFINE_ONLY
            work[i]=mirvar_mem(_MIPP_ mem1,i);
#endif
        }

        epoint_copy(pt,table[0]);
        epoint_copy(table[0],table[MR_ECC_STORE_N-1]);
        ecurve_double(_MIPP_ table[MR_ECC_STORE_N-1]);
     /*   epoint_norm(_MIPP_ table[MR_ECC_STORE_N-1]); */

        for (i=1;i<MR_ECC_STORE_N-1;i++)
        { /* precomputation */
            epoint_copy(table[i-1],table[i]);
            ecurve_add(_MIPP_ table[MR_ECC_STORE_N-1],table[i]);
        }
        ecurve_add(_MIPP_ table[MR_ECC_STORE_N-2],table[MR_ECC_STORE_N-1]);

#ifndef MR_AFFINE_ONLY
        epoint_multi_norm(_MIPP_ MR_ECC_STORE_N,work,table);
#endif

        nb=logb2(_MIPP_ mr_mip->w10);
        nadds=0;
        epoint_set(_MIPP_ NULL,NULL,0,pt);
        for (i=nb-1;i>=1;)
        { /* add/subtract */
            if (mr_mip->user!=NULL) (*mr_mip->user)();
            n=mr_naf_window(_MIPP_ mr_mip->w9,mr_mip->w10,i,&nbs,&nzs,MR_ECC_STORE_N);
            for (j=0;j<nbs;j++)
                ecurve_double(_MIPP_ pt);
            if (n>0) {ecurve_add(_MIPP_ table[n/2],pt); nadds++;}
            if (n<0) {ecurve_sub(_MIPP_ table[(-n)/2],pt); nadds++;}
            i-=nbs;
            if (nzs)
            {
                for (j=0;j<nzs;j++) ecurve_double(_MIPP_ pt);
                i-=nzs;
            }
        }

        ecp_memkill(_MIPP_ mem,MR_ECC_STORE_N);
#ifndef MR_AFFINE_ONLY
        memkill(_MIPP_ mem1,MR_ECC_STORE_N);
#endif

#ifndef MR_STATIC
#ifndef MR_ALWAYS_BINARY
    }
    else
    { 
        mem=(char *)ecp_memalloc(_MIPP_ 1);
        p=epoint_init_mem(_MIPP_ mem,0);
        epoint_norm(_MIPP_ pt);
        epoint_copy(pt,p);

        nadds=0;
        expb2(_MIPP_ logb2(_MIPP_ mr_mip->w10)-1,mr_mip->w11);
        mr_psub(_MIPP_ mr_mip->w10,mr_mip->w11,mr_mip->w10);
        subdiv(_MIPP_ mr_mip->w11,2,mr_mip->w11);
        while (size(mr_mip->w11) > 1)
        { /* add/subtract method */
            if (mr_mip->user!=NULL) (*mr_mip->user)();

            ecurve_double(_MIPP_ pt);
            ce=mr_compare(mr_mip->w9,mr_mip->w11); /* e(i)=1? */
            ch=mr_compare(mr_mip->w10,mr_mip->w11); /* h(i)=1? */
            if (ch>=0) 
            {  /* h(i)=1 */
                if (ce<0) {ecurve_add(_MIPP_ p,pt); nadds++;}
                mr_psub(_MIPP_ mr_mip->w10,mr_mip->w11,mr_mip->w10);
            }
            if (ce>=0) 
            {  /* e(i)=1 */
                if (ch<0) {ecurve_sub(_MIPP_ p,pt); nadds++;}
                mr_psub(_MIPP_ mr_mip->w9,mr_mip->w11,mr_mip->w9);  
            }
            subdiv(_MIPP_ mr_mip->w11,2,mr_mip->w11);
        }
        ecp_memkill(_MIPP_ mem,1);
    }
#endif
#endif
    MR_OUT
    return nadds;
}
```


```c
int ecurve_mult(_MIPD_ big e,epoint *pa,epoint *pt)
{ /* pt=e*pa; */
    int i,j,n,nb,nbs,nzs,nadds;
    epoint *table[MR_ECC_STORE_N];

#ifdef MR_STATIC
    char mem[MR_ECP_RESERVE(MR_ECC_STORE_N)];  
#else
    char *mem;
#endif

#ifndef MR_ALWAYS_BINARY
    epoint *p;
    int ce,ch;
#endif
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    if (mr_mip->ERNUM) return 0;

    MR_IN(95)
    if (size(e)==0) 
    { /* multiplied by 0 */
        epoint_set(_MIPP_ NULL,NULL,0,pt);
        MR_OUT
        return 0;
    }
    copy(e,mr_mip->w9);
    epoint_copy(pa,pt);

    if (size(mr_mip->w9)<0)
    { /* pt = -pt */
        negify(mr_mip->w9,mr_mip->w9);
        epoint_negate(_MIPP_ pt);
    }

    if (size(mr_mip->w9)==1)
    { 
        MR_OUT
        return 0;
    }

    premult(_MIPP_ mr_mip->w9,3,mr_mip->w10);      /* h=3*e */

#ifndef MR_STATIC
#ifndef MR_ALWAYS_BINARY
    if (mr_mip->base==mr_mip->base2)
    {
#endif
#endif

#ifdef  MR_STATIC
        memset(mem,0,MR_ECP_RESERVE(MR_ECC_STORE_N));
#else
        mem=(char *)ecp_memalloc(_MIPP_ MR_ECC_STORE_N);
#endif

        for (i=0;i<=MR_ECC_STORE_N-1;i++)
            table[i]=epoint_init_mem(_MIPP_ mem,i);

        epoint_copy(pt,table[0]);
        epoint_copy(table[0],table[MR_ECC_STORE_N-1]);
        ecurve_double(_MIPP_ table[MR_ECC_STORE_N-1]);

        for (i=1;i<MR_ECC_STORE_N-1;i++)
        { /* precomputation */
            epoint_copy(table[i-1],table[i]);
            ecurve_add(_MIPP_ table[MR_ECC_STORE_N-1],table[i]);
        }
        ecurve_add(_MIPP_ table[MR_ECC_STORE_N-2],table[MR_ECC_STORE_N-1]);

        nb=logb2(_MIPP_ mr_mip->w10);
        nadds=0;
        epoint_set(_MIPP_ NULL,NULL,0,pt);
        for (i=nb-1;i>=1;)
        { /* add/subtract */
            if (mr_mip->user!=NULL) (*mr_mip->user)();
            n=mr_naf_window(_MIPP_ mr_mip->w9,mr_mip->w10,i,&nbs,&nzs,MR_ECC_STORE_N);
            for (j=0;j<nbs;j++)
                ecurve_double(_MIPP_ pt);
            if (n>0) {ecurve_add(_MIPP_ table[n/2],pt); nadds++;}
            if (n<0) {ecurve_sub(_MIPP_ table[(-n)/2],pt); nadds++;}
            i-=nbs;
            if (nzs)
            {
                for (j=0;j<nzs;j++) ecurve_double(_MIPP_ pt);
                i-=nzs;
            }
        }

        ecp_memkill(_MIPP_ mem,MR_ECC_STORE_N);


#ifndef MR_STATIC
#ifndef MR_ALWAYS_BINARY
    }
    else
    { 
        mem=(char *)ecp_memalloc(_MIPP_ 1);
        p=epoint_init_mem(_MIPP_ mem,0);
        epoint_copy(pt,p);

        nadds=0;
        expb2(_MIPP_ logb2(_MIPP_ mr_mip->w10)-1,mr_mip->w11);
        mr_psub(_MIPP_ mr_mip->w10,mr_mip->w11,mr_mip->w10);
        subdiv(_MIPP_ mr_mip->w11,2,mr_mip->w11);
        while (size(mr_mip->w11) > 1)
        { /* add/subtract method */
            if (mr_mip->user!=NULL) (*mr_mip->user)();

            ecurve_double(_MIPP_ pt);
            ce=mr_compare(mr_mip->w9,mr_mip->w11); /* e(i)=1? */
            ch=mr_compare(mr_mip->w10,mr_mip->w11); /* h(i)=1? */
            if (ch>=0) 
            {  /* h(i)=1 */
                if (ce<0) {ecurve_add(_MIPP_ p,pt); nadds++;}
                mr_psub(_MIPP_ mr_mip->w10,mr_mip->w11,mr_mip->w10);
            }
            if (ce>=0) 
            {  /* e(i)=1 */
                if (ch<0) {ecurve_sub(_MIPP_ p,pt); nadds++;}
                mr_psub(_MIPP_ mr_mip->w9,mr_mip->w11,mr_mip->w9);  
            }
            subdiv(_MIPP_ mr_mip->w11,2,mr_mip->w11);
        }
        ecp_memkill(_MIPP_ mem,1);
    }
#endif
#endif
    MR_OUT
    return nadds;
}
```