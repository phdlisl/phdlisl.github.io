# mr_comba_halfm

`mr_comba_halfm`

函数功能：

参数：

```c
static void mr_comba_halfm(mr_small *x,mr_small *y,mr_small *z)
{ /* multiply two arrays, but only return lower half */
    mr_small *a,*b,*c;
#ifdef MR_ITANIUM
    register mr_small lo1,hi1,lo2,hi2,ma,mb,sumlo,sumhi,extra;
#endif
#ifdef MR_WIN64
    mr_small lo,hi,sumlo,sumhi,extra;
#endif
#ifdef MR_NOASM
 #ifdef mr_qltype
    mr_large pp1;
    mr_vlarge sum;
 #else
    register mr_small extra,s0,s1;
    mr_large pp1,pp2,sum;
 #endif
#endif
    a=x; b=y;  c=z;
   
/*** MULTUP ***/

}
```



