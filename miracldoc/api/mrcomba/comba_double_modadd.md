# comba_double_modadd

`comba_double_modadd`

```c
extern void  comba_double_modadd(_MIPT_ big,big,big);
```

函数功能：

参数

## 源码分析

`comba_double_modadd`在模板文件`mrcomba.tpl`实现。

```c
void comba_double_modadd(_MIPD_ big x,big y,big w)
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
    mr_small ma,u;
#endif
#ifdef MR_NOASM
    mr_large u;
#endif
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    modulus=mr_mip->pR;
    if (w!=x && w!=y) 
    {
        for (i=2*MR_COMBA;i<(w->len&MR_OBITS);i++) w->w[i]=0;
        /* zero(w); */
    }
    
    a=x->w; b=y->w; c=w->w;
/*** ADDITION2 ***/        /* add a and b, result in c */
    w->len=2*MR_COMBA;

/* if sum is greater than modulus a decrement will be required */

    dodec=FALSE;
    if (carry) dodec=TRUE;  /* possible misprediction here */
    else
    {
        if (w->w[2*MR_COMBA-1]>modulus->w[2*MR_COMBA-1]) dodec=TRUE; /* possible misprediction here */
	else
	{
            if (w->w[2*MR_COMBA-1]==modulus->w[2*MR_COMBA-1]) /* this will be very rare, so easily predicted */
	    {
	        if (mr_compare(w,modulus)>=0) dodec=TRUE; /* do full comparison */
	    }
	}
    }

    if (dodec)  /* prediction here correlated to earlier predictions, so should predict nicely */
    {
         a=&(w->w[MR_COMBA]); b=&(modulus->w[MR_COMBA]);
/*** DECREMENT ***/        /* decrement b from a */
    }
    if (w->w[2*MR_COMBA-1]==0) mr_lzero(w);   

}
```

