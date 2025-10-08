# mr_invert

`mr_invert`


```c
#ifdef MR_FP_ROUNDING
extern mr_large mr_invert(mr_small);
#endif
```


```c
/* Invert n and set FP rounding. 
 * Set to round up
 * Calculate 1/n
 * set to round down (towards zero)
 * If rounding cannot be controlled, this function returns 0.0 */

mr_large mr_invert(mr_small n)
{
    mr_large inn;
    int up=  0x1BFF; 

#ifdef _MSC_VER
  #ifdef MR_NOASM
#define NO_EXTENDED
  #endif 
#endif

#ifdef NO_EXTENDED
    int down=0x1EFF;
#else
    int down=0x1FFF;
#endif

#ifdef __TURBOC__
    asm
    {
        fldcw WORD PTR up
        fld1
        fld QWORD PTR n;
        fdiv
        fstp TBYTE PTR inn;
        fldcw WORD PTR down;
    }
    return inn;   
#endif
#ifdef _MSC_VER
    _asm
    {
        fldcw WORD PTR up
        fld1
        fld QWORD PTR n;
        fdiv
        fstp QWORD  PTR inn;
        fldcw WORD PTR down;
    }
    return inn;   
#endif
#ifdef __GNUC__
#ifdef i386
    __asm__ __volatile__ (
    "fldcw %2\n"
    "fld1\n"
    "fldl %1\n"
    "fdivrp\n"
    "fstpt %0\n"
    "fldcw %3\n"
    : "=m"(inn)
    : "m"(n),"m"(up),"m"(down)
    : "memory"
    );
    return inn;   
#else
    fpsetround(FP_RP);
    inn=(mr_large)1.0/n;
    fpsetround(FP_RZ);
    return inn;
#endif
#endif
    return 0.0L;   
}
```