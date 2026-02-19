//Paleta de colores
export const colors = {
    primary: '#FF6B35',        
    secondary: '#004E89',      
    accent: '#F7931E',         

    background: '#FFFFFF',     
    surface: '#F5F5F5',       

    success: '#06D6A0',      
    error: '#EF476F',          
    warning: '#FFB703',      
    info: '#0096FF',     

    text: '#2C3E50',          
    textLight: '#7F8C8D',     
    textDisabled: '#BDC3C7',   

    border: '#E0E0E0',         
    divider: '#E8E8E8',        
    disabled: '#BDC3C7',       

    gradientStart: '#FF6B35',
    gradientEnd: '#F7931E',
};


//Espaciado
export const spacing = {
    xs: 4,    
    sm: 8,     
    md: 16,     
    lg: 24,    
    xl: 32,    
    xxl: 48,  
};


//Radios de los bordes
export const borderRadius = {
    sm: 4,      
    md: 8,      
    lg: 12,     
    xl: 16,   
    full: 999, 
};

//Tipografía
export const typography = {
    h1: {
        fontSize: 32,
        fontWeight: '700' as const,
        lineHeight: 40,
        letterSpacing: -0.5,
    },

    h2: {
        fontSize: 24,
        fontWeight: '700' as const,
        lineHeight: 32,
        letterSpacing: -0.3,
    },

    h3: {
        fontSize: 20,
        fontWeight: '600' as const,
        lineHeight: 28,
        letterSpacing: -0.2,
    },

    h4: {
        fontSize: 16,
        fontWeight: '600' as const,
        lineHeight: 24,
        letterSpacing: 0,
    },

    body: {
        fontSize: 14,
        fontWeight: '400' as const,
        lineHeight: 20,
        letterSpacing: 0.1,
    },

    bodySmall: {
        fontSize: 12,
        fontWeight: '400' as const,
        lineHeight: 18,
        letterSpacing: 0.1,
    },

    button: {
        fontSize: 14,
        fontWeight: '600' as const,
        lineHeight: 20,
        letterSpacing: 0.5,
    },

    caption: {
        fontSize: 12,
        fontWeight: '500' as const,
        lineHeight: 16,
        letterSpacing: 0.2,
    },

    label: {
        fontSize: 13,
        fontWeight: '500' as const,
        lineHeight: 18,
        letterSpacing: 0.3,
    },
};


//Sombras
export const shadows = {
    small: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
    },

    medium: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 5.46,
        elevation: 4,
    },

    large: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 10.32,
        elevation: 8,
    },

    extraLarge: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.25,
        shadowRadius: 15.46,
        elevation: 12,
    },

    card: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 4.65,
        elevation: 3,
    },
};


//Tamaños
export const sizes = {
    buttonHeight: 48,
    buttonHeightSmall: 40,
    buttonHeightLarge: 56,

    iconSmall: 16,
    iconMedium: 24,
    iconLarge: 32,
    iconExtraLarge: 48,

    avatarSmall: 32,
    avatarMedium: 48,
    avatarLarge: 64,

    inputHeight: 48,
    inputHeightSmall: 40,

    imageThumbnail: 80,
    imageSmall: 100,
    imageMedium: 200,
    imageLarge: 300,
};

//Z-Index
export const zIndex = {
    hidden: -1,
    base: 0,
    dropdown: 10,
    sticky: 20,
    fixed: 30,
    modal: 40,
    popover: 50,
    tooltip: 60,
};

//Composiciones de estilos comunes
export const commonStyles = {
    centeredAbsolute: {
        position: 'absolute' as const,
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },

    centered: {
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
    },

    row: {
        flexDirection: 'row' as const,
    },

    column: {
        flexDirection: 'column' as const,
    },

    flex1: {
        flex: 1,
    },

    borderLine: {
        height: 1,
        backgroundColor: colors.border,
    },

    container: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.lg,
    },

    containerSmall: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
    },
};


//Estilos de compontentes
export const componentStyles = {
    input: {
        base: {
            height: sizes.inputHeight,
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: borderRadius.md,
            fontSize: typography.body.fontSize,
            color: colors.text,
            backgroundColor: colors.background,
        },
        focused: {
            borderColor: colors.primary,
            borderWidth: 2,
        },
        error: {
            borderColor: colors.error,
        },
        disabled: {
            backgroundColor: colors.surface,
            color: colors.textDisabled,
        },
    },

    button: {
        base: {
            height: sizes.buttonHeight,
            borderRadius: borderRadius.md,
            justifyContent: 'center' as const,
            alignItems: 'center' as const,
            flexDirection: 'row' as const,
            gap: spacing.sm,
        },
        primary: {
            backgroundColor: colors.primary,
        },
        secondary: {
            backgroundColor: colors.secondary,
        },
        outlined: {
            backgroundColor: colors.background,
            borderWidth: 1,
            borderColor: colors.primary,
        },
        ghost: {
            backgroundColor: 'transparent',
        },
        disabled: {
            backgroundColor: colors.disabled,
            opacity: 0.6,
        },
        small: {
            height: sizes.buttonHeightSmall,
        },
        large: {
            height: sizes.buttonHeightLarge,
        },
    },

    card: {
        base: {
            backgroundColor: colors.background,
            borderRadius: borderRadius.lg,
            overflow: 'hidden' as const,
            ...shadows.small,
        },
        padded: {
            padding: spacing.lg,
        },
        outlined: {
            borderWidth: 1,
            borderColor: colors.border,
        },
    },

    modal: {
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        content: {
            backgroundColor: colors.background,
            borderRadius: borderRadius.xl,
            ...shadows.large,
        },
    },

    badge: {
        base: {
            paddingHorizontal: spacing.md,
            paddingVertical: spacing.sm,
            borderRadius: borderRadius.full,
            alignSelf: 'flex-start' as const,
        },
        primary: {
            backgroundColor: colors.primary,
        },
        secondary: {
            backgroundColor: colors.secondary,
        },
        success: {
            backgroundColor: colors.success,
        },
        error: {
            backgroundColor: colors.error,
        },
        warning: {
            backgroundColor: colors.warning,
        },
    },
};


//Layout
export const layout = {
    screenHorizontalPadding: spacing.lg,
    screenVerticalPadding: spacing.lg,
    headerHeight: 56,
    tabBarHeight: 56,
    bottomSheetRadius: borderRadius.xl,
};

//Tema completo
export const theme = {
    colors,
    spacing,
    typography,
    borderRadius,
    shadows,
    sizes,
    zIndex,
    commonStyles,
    componentStyles,
    layout,
};

export default {
    colors,
    spacing,
    typography,
    borderRadius,
    shadows,
    sizes,
    zIndex,
    commonStyles,
    componentStyles,
    layout,
};