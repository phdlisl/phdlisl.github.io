# mr_pmul

`mr_pmul`

```c
extern void  mr_pmul(_MIPT_ big,mr_small,big);
```

```c
void mr_pmul(_MIPD_ big x,mr_small sn,big z)
{ 
    int m,xl;
    mr_lentype sx;
    mr_small carry,*xg,*zg;

#ifdef MR_ITANIUM
    mr_small tm;
#endif
#ifdef MR_WIN64
    mr_small tm;
#endif
#ifdef MR_NOASM
    union doubleword dble;
    mr_large dbled;
    mr_large ldres;
#endif
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif

    if (x!=z)
    {
        zero(z);
        if (sn==0) return;
    }
    else if (sn==0)
    {
        zero(z);
        return;
    }
    m=0;
    carry=0;
    sx=x->len&MR_MSBIT;
    xl=(int)(x->len&MR_OBITS);

#ifndef MR_SIMPLE_BASE
    if (mr_mip->base==0) 
    {
#endif
#ifndef MR_NOFULLWIDTH
        xg=x->w; zg=z->w;
/* inline 8086 assembly - substitutes for loop below */
#ifdef INLINE_ASM
#if INLINE_ASM == 1
        ASM cld
        ASM mov cx,xl
        ASM or cx,cx
        ASM je out1
#ifdef MR_LMM
        ASM push ds
        ASM push es
        ASM les di,DWORD PTR zg
        ASM lds si,DWORD PTR xg
#else
        ASM mov ax,ds
        ASM mov es,ax
        ASM mov di,zg
        ASM mov si,xg
#endif
        ASM mov bx,sn
        ASM push bp
        ASM xor bp,bp
    tcl1:
        ASM lodsw
        ASM mul bx
        ASM add ax,bp
        ASM adc dx,0
        ASM stosw
        ASM mov bp,dx
        ASM loop tcl1

        ASM mov ax,bp
        ASM pop bp
#ifdef MR_LMM
        ASM pop es
        ASM pop ds
#endif
        ASM mov carry,ax
     out1: 
#endif
#if INLINE_ASM == 2
        ASM cld
        ASM mov cx,xl
        ASM or cx,cx
        ASM je out1
#ifdef MR_LMM
        ASM push ds
        ASM push es
        ASM les di,DWORD PTR zg
        ASM lds si,DWORD PTR xg
#else
        ASM mov ax,ds
        ASM mov es,ax
        ASM mov di,zg
        ASM mov si,xg
#endif
        ASM mov ebx,sn
        ASM push ebp
        ASM xor ebp,ebp
    tcl1:
        ASM lodsd
        ASM mul ebx
        ASM add eax,ebp
        ASM adc edx,0
        ASM stosd
        ASM mov ebp,edx
        ASM loop tcl1

        ASM mov eax,ebp
        ASM pop ebp
#ifdef MR_LMM
        ASM pop es
        ASM pop ds
#endif
        ASM mov carry,eax
     out1: 
#endif
#if INLINE_ASM == 3
        ASM mov ecx,xl
        ASM or ecx,ecx
        ASM je out1
        ASM mov ebx,sn
        ASM mov edi,zg
        ASM mov esi,xg
        ASM push ebp
        ASM xor ebp,ebp
    tcl1:
        ASM mov eax,[esi]
        ASM add esi,4
        ASM mul ebx
        ASM add eax,ebp
        ASM adc edx,0
        ASM mov [edi],eax
        ASM add edi,4
        ASM mov ebp,edx
        ASM dec ecx
        ASM jnz tcl1

        ASM mov eax,ebp
        ASM pop ebp
        ASM mov carry,eax
     out1: 
#endif
#if INLINE_ASM == 4

        ASM (
           "movl %4,%%ecx\n"
           "orl  %%ecx,%%ecx\n"
           "je 1f\n"
           "movl %3,%%ebx\n"
           "movl %1,%%edi\n"
           "movl %2,%%esi\n"
           "pushl %%ebp\n"
           "xorl %%ebp,%%ebp\n"  
        "0:\n"  
           "movl (%%esi),%%eax\n"
           "addl $4,%%esi\n"
           "mull %%ebx\n"
           "addl %%ebp,%%eax\n"
           "adcl $0,%%edx\n"
           "movl %%eax,(%%edi)\n"
           "addl $4,%%edi\n"
           "movl %%edx,%%ebp\n"
           "decl %%ecx\n"
           "jnz 0b\n"
 
           "movl %%ebp,%%eax\n"
           "popl %%ebp\n"
           "movl %%eax,%0\n"
        "1:"  
        :"=m"(carry)
        :"m"(zg),"m"(xg),"m"(sn),"m"(xl)
        :"eax","edi","esi","ebx","ecx","edx","memory"
        );

#endif
#endif
#ifndef INLINE_ASM
        for (m=0;m<xl;m++)
#ifdef MR_NOASM
        {
            dble.d=(mr_large)x->w[m]*sn+carry;
            carry=dble.h[MR_TOP];
            z->w[m]=dble.h[MR_BOT];
        }
#else
            carry=muldvd(x->w[m],sn,carry,&z->w[m]);
#endif
#endif
        if (carry>0)
        {
            m=xl;
            if (m>=mr_mip->nib && mr_mip->check)
            {
                mr_berror(_MIPP_ MR_ERR_OVERFLOW);
                return;
            }
            z->w[m]=carry;
            z->len=m+1;
        }
        else z->len=xl;
#endif
#ifndef MR_SIMPLE_BASE
    }
    else while (m<xl || carry>0)
    { /* multiply each digit of x by n */ 
    
        if (m>mr_mip->nib && mr_mip->check)
        {
            mr_berror(_MIPP_ MR_ERR_OVERFLOW);
            return;
        }
#ifdef MR_NOASM
        dbled=(mr_large)x->w[m]*sn+carry;
 #ifdef MR_FP_ROUNDING
        carry=(mr_small)MR_LROUND(dbled*mr_mip->inverse_base);
 #else
  #ifndef MR_FP
        if (mr_mip->base==mr_mip->base2)
          carry=(mr_small)(dbled>>mr_mip->lg2b);
        else 
  #endif  
          carry=(mr_small)MR_LROUND(dbled/mr_mip->base);
 #endif
        z->w[m]=(mr_small)(dbled-(mr_large)carry*mr_mip->base);
#else
 #ifdef MR_FP_ROUNDING
        carry=imuldiv(x->w[m],sn,carry,mr_mip->base,mr_mip->inverse_base,&z->w[m]);
 #else
        carry=muldiv(x->w[m],sn,carry,mr_mip->base,&z->w[m]);
 #endif
#endif

        m++;
        z->len=m;
    }
#endif
    if (z->len!=0) z->len|=sx;
}
```