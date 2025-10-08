# miracl类型

`miracl`类型定义在`miracl.h`

```c
typedef struct {
mr_small base;       /* number base     */
mr_small apbase;     /* apparent base   */
int   pack;          /* packing density */
int   lg2b;          /* bits in base    */
mr_small base2;      /* 2^mr_lg2b          */
BOOL (*user)(void);  /* pointer to user supplied function */

int   nib;           /* length of bigs  */
#ifndef MR_STRIPPED_DOWN
int   depth;                 /* error tracing ..*/
int   trace[MR_MAXDEPTH];    /* .. mechanism  最大深度  */
#endif
BOOL  check;         /* overflow check  */
BOOL  fout;          /* Output to file   */
BOOL  fin;           /* Input from file  */
BOOL  active;

#ifndef MR_NO_FILE_IO

FILE  *infile;       /* Input file       */
FILE  *otfile;       /* Output file      */

#endif


#ifndef MR_NO_RAND
mr_unsign32 ira[NK];  /* random number...   */
int         rndptr;   /* ...array & pointer */
mr_unsign32 borrow;
#endif

            /* Montgomery constants */
mr_small ndash;
big modulus;
big pR;
BOOL ACTIVE;
BOOL MONTY;

                       /* Elliptic Curve details   */
#ifndef MR_NO_SS
BOOL SS;               /* True for Super-Singular  */
#endif
#ifndef MR_NOKOBLITZ
BOOL KOBLITZ;          /* True for a Koblitz curve */
#endif
#ifndef MR_AFFINE_ONLY
int coord;
#endif
int Asize,Bsize;

int M,AA,BB,CC;     /* for GF(2^m) curves */

/*
mr_small pm,mask;
int e,k,Me,m;       for GF(p^m) curves */


#ifndef MR_STATIC

int logN;           /* constants for fast fourier fft multiplication */
int nprimes,degree;
mr_utype *prime,*cr;
mr_utype *inverse,**roots;
small_chinese chin;
mr_utype const1,const2,const3;
mr_small msw,lsw;
mr_utype **s1,**s2;   /* pre-computed tables for polynomial reduction */
mr_utype **t;         /* workspace */
mr_utype *wa;
mr_utype *wb;
mr_utype *wc;

#endif

BOOL same;
BOOL first_one;
BOOL debug;

big w0;            /* workspace bigs  */
big w1,w2,w3,w4;
big w5,w6,w7;
big w8,w9,w10,w11;
big w12,w13,w14,w15;
big sru;
big one;

#ifdef MR_KCM
big big_ndash;
big ws,wt;
#endif

big A,B;

/* User modifiables */

#ifndef MR_SIMPLE_IO
int  IOBSIZ;       /* size of i/o buffer */
#endif
BOOL ERCON;        /* error control   */
int  ERNUM;        /* last error code, 错误提示类型编码已定义有29种。 */
int  NTRY;         /* no. of tries for probablistic primality testing   */
#ifndef MR_SIMPLE_IO
int  INPLEN;       /* input length               */
#ifndef MR_SIMPLE_BASE
int  IOBASE;       /* base for input and output */

#endif
#endif
#ifdef MR_FLASH
BOOL EXACT;        /* exact flag      */
BOOL RPOINT;       /* =ON for radix point, =OFF for fractions in output */
#endif
#ifndef MR_STRIPPED_DOWN
BOOL TRACER;       /* turns trace tracker on/off */
#endif

#ifdef MR_STATIC
const int *PRIMES;                      /* small primes array         */
#ifndef MR_SIMPLE_IO
char IOBUFF[MR_DEFAULT_BUFFER_SIZE];    /* i/o buffer    */
#endif
#else
int *PRIMES;        /* small primes array         */
#ifndef MR_SIMPLE_IO
char *IOBUFF;       /* i/o buffer    */
#endif
#endif

#ifdef MR_FLASH
int   workprec;
int   stprec;        /* start precision */

int RS,RD;
double D;

double db,n,p;
int a,b,c,d,r,q,oldn,ndig;
mr_small u,v,ku,kv;

BOOL last,carryon;
flash pi;

#endif

#ifdef MR_FP_ROUNDING
mr_large inverse_base;
#endif

#ifndef MR_STATIC
char *workspace;
#else
char workspace[MR_BIG_RESERVE(MR_SPACES)];
#endif

int TWIST; /* set to twisted curve */
int qnr;    /* a QNR -1 for p=3 mod 4, -2 for p=5 mod 8, 0 otherwise */
int cnr;    /* a cubic non-residue */
int pmod8;
int pmod9;
BOOL NO_CARRY;
} miracl;
```

`mr_mip->ERNUM`错误提示码[mr_berror](/parts/api/mrcore/mr_berror.md)已定义有29种。