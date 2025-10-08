# mr_sdiv

`mr_sdiv`定义在`miracl.h`

```c
#ifdef MR_FP_ROUNDING
extern mr_small mr_sdiv(_MIPT_ big,mr_small,mr_large,big);
#else
extern mr_small mr_sdiv(_MIPT_ big,mr_small,big);
#endif

```c
#ifdef MR_FP_ROUNDING
mr_small mr_sdiv(_MIPD_ big x,mr_small sn,mr_large isn,big z)
#else
mr_small mr_sdiv(_MIPD_ big x,mr_small sn,big z)
#endif
{
    int i,xl;
    mr_small sr,*xg,*zg;
#ifdef MR_NOASM
    union doubleword dble;
    mr_large dbled;
    mr_large ldres;
#endif
#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif
    sr=0;
    xl=(int)(x->len&MR_OBITS);
    if (x!=z) zero(z);
#ifndef MR_SIMPLE_BASE
    if (mr_mip->base==0) 
    {
#endif
#ifndef MR_NOFULLWIDTH
        xg=x->w; zg=z->w;
/* inline - substitutes for loop below */
#ifdef INLINE_ASM
#if INLINE_ASM == 1
        ASM std
        ASM mov cx,xl
        ASM or cx,cx
        ASM je out2
        ASM mov bx,cx
        ASM shl bx,1
        ASM sub bx,2
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
        ASM add si,bx
        ASM add di,bx
        ASM mov bx,sn
        ASM push bp
        ASM xor bp,bp
    tcl2:
        ASM mov dx,bp
        ASM lodsw
        ASM div bx
        ASM mov bp,dx
        ASM stosw
        ASM loop tcl2

        ASM mov ax,bp
        ASM pop bp
#ifdef MR_LMM
        ASM pop es
        ASM pop ds
#endif
        ASM mov sr,ax
     out2:
        ASM cld
#endif
#if INLINE_ASM == 2
        ASM std
        ASM mov cx,xl
        ASM or cx,cx
        ASM je out2
        ASM mov bx,cx
        ASM shl bx,2
        ASM sub bx,4
#ifdef MR_LMM
        ASM push ds
        ASM push es
        ASM les di,DWORD PTR zg
        ASM lds si,DWORD PTR xg
#else
        ASM mov ax,ds
        ASM mov es,ax
        ASM mov di, zg
        ASM mov si, xg
#endif
        ASM add si,bx
        ASM add di,bx
        ASM mov ebx,sn
        ASM push ebp
        ASM xor ebp,ebp
    tcl2:
        ASM mov edx,ebp
        ASM lodsd
        ASM div ebx
        ASM mov ebp,edx
        ASM stosd
        ASM loop tcl2

        ASM mov eax,ebp
        ASM pop ebp
#ifdef MR_LMM
        ASM pop es
        ASM pop ds
#endif
        ASM mov sr,eax
     out2: 
        ASM cld
#endif
#if INLINE_ASM == 3
        ASM mov ecx,xl
        ASM or ecx,ecx
        ASM je out2
        ASM mov ebx,ecx
        ASM shl ebx,2
        ASM mov esi, xg
        ASM add esi,ebx
        ASM mov edi, zg
        ASM add edi,ebx
        ASM mov ebx,sn
        ASM push ebp
        ASM xor ebp,ebp
    tcl2:
        ASM sub esi,4
        ASM mov edx,ebp
        ASM mov eax,[esi]
        ASM div ebx
        ASM sub edi,4
        ASM mov ebp,edx
        ASM mov [edi],eax
        ASM dec ecx
        ASM jnz tcl2

        ASM mov eax,ebp
        ASM pop ebp
        ASM mov sr,eax
     out2:
        ASM nop
#endif
#if INLINE_ASM == 4

        ASM (
           "movl %4,%%ecx\n"
           "orl  %%ecx,%%ecx\n"
           "je 3f\n"
           "movl %%ecx,%%ebx\n"
           "shll $2,%%ebx\n"
           "movl %2,%%esi\n"
           "addl %%ebx,%%esi\n"
           "movl %1,%%edi\n"
           "addl %%ebx,%%edi\n"
           "movl %3,%%ebx\n"
           "pushl %%ebp\n"
           "xorl %%ebp,%%ebp\n"  
         "2:\n"  
           "subl $4,%%esi\n"
           "movl %%ebp,%%edx\n"
           "movl (%%esi),%%eax\n"
           "divl %%ebx\n"
           "subl $4,%%edi\n"
           "movl %%edx,%%ebp\n"
           "movl %%eax,(%%edi)\n"
           "decl %%ecx\n"
           "jnz 2b\n"
 
           "movl %%ebp,%%eax\n"
           "popl %%ebp\n"
           "movl %%eax,%0\n"
        "3:"
           "nop"  
        :"=m"(sr)
        :"m"(zg),"m"(xg),"m"(sn),"m"(xl)
        :"eax","edi","esi","ebx","ecx","edx","memory"
        );
#endif
#endif
#ifndef INLINE_ASM
        for (i=xl-1;i>=0;i--)
        {
#ifdef MR_NOASM
            dble.h[MR_BOT]=x->w[i];
            dble.h[MR_TOP]=sr;
            z->w[i]=(mr_small)(dble.d/sn);
            sr=(mr_small)(dble.d-(mr_large)z->w[i]*sn);
#else
            z->w[i]=muldvm(sr,x->w[i],sn,&sr);
#endif
        }
#endif
#endif
#ifndef MR_SIMPLE_BASE
    }
    else for (i=xl-1;i>=0;i--)
    { /* divide each digit of x by n */
#ifdef MR_NOASM
        dbled=(mr_large)sr*mr_mip->base+x->w[i];
#ifdef MR_FP_ROUNDING
        z->w[i]=(mr_small)MR_LROUND(dbled*isn);
#else
        z->w[i]=(mr_small)MR_LROUND(dbled/sn);
#endif
        sr=(mr_small)(dbled-(mr_large)z->w[i]*sn);
#else
#ifdef MR_FP_ROUNDING
        z->w[i]=imuldiv(sr,mr_mip->base,x->w[i],sn,isn,&sr);
#else
        z->w[i]=muldiv(sr,mr_mip->base,x->w[i],sn,&sr);
#endif
#endif
    }
#endif
    z->len=x->len;
    mr_lzero(z);
    return sr;
}
```