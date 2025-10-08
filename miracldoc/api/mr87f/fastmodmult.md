# fastmodmult

`fastmodmult`

```c
extern void  fastmodmult(_MIPT_ big,big,big);
```

```c
void fastmodmult(_MIPD_ big x,big y,big z)
{
    int ij;
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    big w0=mr_mip->w0;
    big modulus=mr_mip->modulus;
    mr_small *wg,*mg,*xg,*yg;
    wg=w0->w;
    mg=modulus->w;
    xg=x->w;
    yg=y->w;

    for (ij=2*MR_PENTIUM;ij<(int)(w0->len&MR_OBITS);ij++) w0->w[ij]=0.0;
    w0->len=2*MR_PENTIUM;

    ASM  
    { 
     FSTEP MACRO i,j  
/* some fancy Pentium scheduling going on here ... */
       fld  POINTER [PBX+N*i]
       fmul POINTER [PSI+N*j]
       fxch st(2)
       fadd           
     ENDM         

     FRSTEP MACRO i,j  
       fld  POINTER [PDI+N*i]
       fmul POINTER [PSI+N*j]
       fxch st(2)
       fadd
     ENDM         

     FDSTEP MACRO i,j  
       fld  POINTER [PBX+N*i]
       fmul POINTER [PBX+N*j]
       fxch st(2)
       fadd
     ENDM          

     SELF MACRO k 
       fld POINTER [PBX+N*k]
       fmul st,st(0)
       fadd
     ENDM          

     RFINU MACRO k  
       fld  st(0)

       fadd st,st(2)
       fsub st,st(2)

       fsubr st,st(1)      
       fmul st,st(4)
       fld  st(0)

       fadd st,st(3)
       fsub st,st(3)

       fsub
       fst  POINTER [PDI+N*k]
       fmul POINTER [PSI]
       fadd
       fmul st,st(2)   
     ENDM           

     RFIND MACRO k  
       fld st(0)

       fadd st,st(2)
       fsub st,st(2)

       fsub st(1),st
       fmul st,st(3)
       fxch st(1)
       fstp POINTER [PDI+N*k]

     ENDM           

     DIAG MACRO ns,ne  
       CNT1=ns         
       CNT2=ne
       fld  POINTER [PBX+N*CNT1]
       fmul POINTER [PSI+N*CNT2]        
       CNT1=CNT1+1   
       CNT2=CNT2-1   
       WHILE CNT1 LE ne 
           FSTEP CNT1,CNT2 
           CNT1=CNT1+1   
           CNT2=CNT2-1   
       ENDM 
       fadd   
     ENDM 

     SDIAG MACRO ns,ne  
        CNT1=ns  
        CNT2=ne 
        IF CNT1 LT CNT2
            fstp st(5)   /* store carry */
            fldz    
            fld  POINTER [PBX+N*CNT1]
            fmul POINTER [PBX+N*CNT2]  
            CNT1=CNT1+1
            CNT2=CNT2-1
            WHILE CNT1 LT CNT2  
                FDSTEP CNT1,CNT2 
                CNT1=CNT1+1     
                CNT2=CNT2-1     
            ENDM
            fadd 
            fld st(0)      /* now double it ... */
            fadd   
            fadd st,st(5)  /* add in carry */
        ENDIF   
     ENDM 

     RDIAGU MACRO ns,ne 
        CNT1=ns  
        CNT2=ne 
        IF CNT1 LT ne 
           fld  POINTER [PDI+N*CNT1]
           fmul POINTER [PSI+N*CNT2]        
           CNT1=CNT1+1
           CNT2=CNT2-1         
           WHILE CNT1 LT ne   
               FRSTEP CNT1,CNT2 
               CNT1=CNT1+1    
               CNT2=CNT2-1    
           ENDM 
           fadd
         ENDIF
     ENDM

     RDIAGD MACRO ns,ne  
       CNT1=ns         
       CNT2=ne
       fld  POINTER [PDI+N*CNT1]
       fmul POINTER [PSI+N*CNT2]        
       CNT1=CNT1+1
       CNT2=CNT2-1         
       WHILE CNT1 LE ne 
           FRSTEP CNT1,CNT2 
           CNT1=CNT1+1   
           CNT2=CNT2-1   
       ENDM    
       fadd
     ENDM 
 
     MODMULT MACRO
        CNT=0
        WHILE CNT LT MR_PENTIUM
            DIAG 0,CNT
            xchg PSI,PCX
            RDIAGU 0,CNT
            RFINU CNT
            xchg PSI,PCX
            CNT=CNT+1
        ENDM
        SCNT=0
        WHILE SCNT LT (MR_PENTIUM-1)
            SCNT=SCNT+1
            DIAG SCNT,(MR_PENTIUM-1)
            xchg PSI,PCX
            RDIAGD SCNT,(MR_PENTIUM-1)
            RFIND CNT
            xchg PSI,PCX
            CNT=CNT+1
        ENDM
        RFIND CNT
        CNT=CNT+1
        fstp POINTER [PDI+N*CNT]
     ENDM

     MODSQUARE MACRO
        CNT=0
        WHILE CNT LT MR_PENTIUM
            SDIAG 0,CNT
            IF (CNT MOD 2) EQ 0
                SELF (CNT/2)
            ENDIF
            RDIAGU 0,CNT
            RFINU CNT
            CNT=CNT+1
        ENDM
        SCNT=0
        WHILE SCNT LT (MR_PENTIUM-1)
            SCNT=SCNT+1
            SDIAG SCNT,(MR_PENTIUM-1)
            IF (CNT MOD 2) EQ 0
                SELF (CNT/2)
            ENDIF
            RDIAGD SCNT,(MR_PENTIUM-1)
            RFIND CNT
            CNT=CNT+1
        ENDM
        RFIND CNT
        CNT=CNT+1
        fstp POINTER [PDI+N*CNT]
     ENDM
    }
    ASM
    {
        push PDI
        push PSI

        mov PBX,xg  
        mov PSI,yg  
        mov PCX,mg
        mov PDI,wg   
   

        fldz

        MODMULT

        pop PSI
        pop PDI
    }  

    for (ij=MR_PENTIUM;ij<(int)(z->len&MR_OBITS);ij++) z->w[ij]=0.0;
    z->len=MR_PENTIUM;
    for (ij=0;ij<MR_PENTIUM;ij++) z->w[ij]=w0->w[ij+MR_PENTIUM];
    if (z->w[MR_PENTIUM-1]==0.0) mr_lzero(z);
} 
```


