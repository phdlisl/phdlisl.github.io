# mr_berror

`mr_berror`定义在`miracl.h`

```c
extern void  mr_berror(_MIPT_ int);
```

函数功能：按层级打印错误提示。

参数`_MIPT_`：可能为空，非空为`miracl *`类型。

参数`nerr`：整数$$1\sim 29$$。错误类型有29种，分别从1到29，其他错误类型为定义。

## 源码分析

根据错误类型`nerr`，用[mputs](/miracldoc/api/mrcore/mputs.md)打印错误提示。

```c
void mr_berror(_MIPD_ int nerr)
{  /*  Big number error routine  */
#ifndef MR_STRIPPED_DOWN
int i;
#endif

#ifdef MR_OS_THREADS
    miracl *mr_mip=get_mip();
#endif

if (mr_mip->ERCON)
{
    mr_mip->ERNUM=nerr; // 错误码
    return;
}
#ifndef MR_NO_STANDARD_IO

#ifndef MR_STRIPPED_DOWN
mputs((char *)"\nMIRACL error from routine ");
if (mr_mip->depth<MR_MAXDEPTH) mputs(names[mr_mip->trace[mr_mip->depth]]);
else                           mputs((char *)"???");
fputc('\n',stdout);

for (i=mr_mip->depth-1;i>=0;i--)
{
    mputs((char *)"              called from ");
    if (i<MR_MAXDEPTH) mputs(names[mr_mip->trace[i]]);
    else               mputs((char *)"???");
    fputc('\n',stdout);
}

switch (nerr)
{
case 1 :
mputs((char *)"Number base too big for representation\n");
break;
case 2 :
mputs((char *)"Division by zero attempted\n");
break;
case 3 : 
mputs((char *)"Overflow - Number too big\n");
break;
case 4 :
mputs((char *)"Internal result is negative\n");
break;
case 5 : 
mputs((char *)"Input format error\n");
break;
case 6 :
mputs((char *)"Illegal number base\n");
break;
case 7 : 
mputs((char *)"Illegal parameter usage\n");
break;
case 8 :
mputs((char *)"Out of space\n");
break;
case 9 :
mputs((char *)"Even root of a negative number\n");
break;
case 10:
mputs((char *)"Raising integer to negative power\n");
break;
case 11:
mputs((char *)"Attempt to take illegal root\n");
break;
case 12:
mputs((char *)"Integer operation attempted on Flash number\n");
break;
case 13:
mputs((char *)"Flash overflow\n");
break;
case 14:
mputs((char *)"Numbers too big\n");
break;
case 15:
mputs((char *)"Log of a non-positive number\n");
break;
case 16:
mputs((char *)"Flash to double conversion failure\n");
break;
case 17:
mputs((char *)"I/O buffer overflow\n");
break;
case 18:
mputs((char *)"MIRACL not initialised - no call to mirsys()\n");
break;
case 19:
mputs((char *)"Illegal modulus \n");
break;
case 20:
mputs((char *)"No modulus defined\n");
break;
case 21:
mputs((char *)"Exponent too big\n");
break;
case 22:
mputs((char *)"Unsupported Feature - check mirdef.h\n");
break;
case 23:
mputs((char *)"Specified double length type isn't double length\n");
break;
case 24:
mputs((char *)"Specified basis is NOT irreducible\n");
break;
case 25:
mputs((char *)"Unable to control Floating-point rounding\n");
break;
case 26:
mputs((char *)"Base must be binary (MR_ALWAYS_BINARY defined in mirdef.h ?)\n");
break;
case 27:
mputs((char *)"No irreducible basis defined\n");
break;
case 28:
mputs((char *)"Composite modulus\n");
break;
case 29:
mputs((char *)"Input/output error when reading from RNG device node\n");
break;
default:
mputs((char *)"Undefined error\n");
break;
}
exit(0);
#else
mputs((char *)"MIRACL error\n");
exit(0);
#endif

#endif
}
```