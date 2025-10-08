# `MR_IN`和`MR_OUT`

`MIRACL`线程的进退码。如果定义了`MR_STRIPPED_DOWN`，线程的进退码为空。

```c
#define MR_MAXDEPTH 24  /* max routine stack depth */

/* Preamble and exit code for MIRACL routines. Not used if MR_STRIPPED_DOWN is defined */ 

#ifdef MR_STRIPPED_DOWN
#define MR_OUT
#define MR_IN(N)
#else
#define MR_OUT  mr_mip->depth--;        
#define MR_IN(N) mr_mip->depth++; if (mr_mip->depth<MR_MAXDEPTH) {mr_mip->trace[mr_mip->depth]=(N); if (mr_mip->TRACER) mr_track(_MIPPO_); }
#endif
```

`MIRACL`线程最大深度为24，只要不超过最大值，都会被记录。

如果定义`MR_GENERIC_MT`，则`_MIPPO_`表示一个`MIRACL`线程实例，否则为空。

```c
#ifdef MR_GENERIC_MT
#define _MIPPO_ mr_mip
#else
#define _MIPPO_    
#endif
```

