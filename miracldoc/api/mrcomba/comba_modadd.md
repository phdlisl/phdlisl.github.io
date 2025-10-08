# comba_modadd

`comba_modadd`

```c
extern void  comba_modadd(_MIPT_ big,big,big);
```

函数功能：

参数

## 源码分析

`comba_modadd`在模板文件`mrcomba.tpl`实现。

```c
void comba_modadd(_MIPD_ big x,big y,big w)
{ /* fast modular addition */
    unsigned int i;
    big modulus;
    BOOL dodec;
    mr_small *a,*b,*c;
    mr_small carry,su; 
#ifdef MR_WIN64
    mr_small ma,mb,u;
#endif
#ifdef MR_ITANIUM
    mr_small ma,mb,u;
#endif
#ifdef MR_NOASM
    mr_large u;
#endif

#ifdef MR_FAST_MOD_ADD
    mr_small sc,t,v;
#endif

#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    modulus=mr_mip->modulus;
    if (w!=x && w!=y) 
    {
        for (i=MR_COMBA;i<(w->len&MR_OBITS);i++) w->w[i]=0;
        /* zero(w); */
    }
    
    a=x->w; b=y->w; c=w->w;
/*** ADDITION ***/        /* add a and b, result in c */
    w->len=MR_COMBA;

#ifdef MR_FAST_MOD_ADD

#if MR_FAST_MOD_ADD == 1

    sc=(mr_small)0-modulus->w[0];  /* Modulus is 2^{MIRACL*MR_COMBA}-c. Here we calculate c */
    t=MR_OP(carry)&sc;
    v=w->w[0]+t;
    if (v>=w->w[0])
    {
	w->w[0]=v;
	carry=0;
    }

#endif

#if MR_FAST_MOD_ADD == 2

    t=(mr_small)(w->w[MR_COMBA-1]>>M1);
    v=w->w[0]+t;
    if (v>=w->w[0])
    {
        w->w[MR_COMBA-1]-=(mr_small)(t<<M1);
	w->w[0]=v;
	carry=0;
    }

#endif

#endif

/* if sum is greater than modulus a decrement will be required */

    dodec=FALSE;
    if (carry) dodec=TRUE;  /* possible misprediction here */
    else
    {
        if (w->w[MR_COMBA-1]>modulus->w[MR_COMBA-1]) dodec=TRUE; /* possible misprediction here */
	else
	{
            if (w->w[MR_COMBA-1]==modulus->w[MR_COMBA-1]) /* this will be very rare, so easily predicted */
	    { /* trying to avoid calling this slow function */
	        if (mr_compare(w,modulus)>=0) dodec=TRUE; /* do full comparison */
	    }
        }
    }

    if (dodec)  /* prediction here correlated to earlier predictions, so should predict nicely */
    {
        a=w->w; b=modulus->w;
/*** DECREMENT ***/        /* decrement b from a */
    }
    
    if (w->w[MR_COMBA-1]==0) mr_lzero(w);   

}
```