
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T extends DefineComponent> = T & DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>>
type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = (T & DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }>)
interface _GlobalComponents {
      'ConfirmationDialog': typeof import("../components/ConfirmationDialog.vue")['default']
    'StatCard': typeof import("../components/StatCard.vue")['default']
    'ThemeToggle': typeof import("../components/ThemeToggle.vue")['default']
    'WelcomeMessage': typeof import("../components/WelcomeMessage.vue")['default']
    'TransactionDialog': typeof import("../components/transaction/TransactionDialog.vue")['default']
    'TransactionTableRow': typeof import("../components/transaction/TransactionTableRow.vue")['default']
    'NuxtWelcome': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/welcome.vue")['default']
    'NuxtLayout': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
    'NuxtErrorBoundary': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
    'ClientOnly': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/client-only")['default']
    'DevOnly': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/dev-only")['default']
    'ServerPlaceholder': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/server-placeholder")['default']
    'NuxtLink': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-link")['default']
    'NuxtLoadingIndicator': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
    'NuxtTime': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
    'NuxtImg': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
    'NuxtPicture': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
    'UiAvatar': typeof import("../components/ui/avatar/index")['Avatar']
    'UiAvatarFallback': typeof import("../components/ui/avatar/index")['AvatarFallback']
    'UiAvatarImage': typeof import("../components/ui/avatar/index")['AvatarImage']
    'UiBadge': typeof import("../components/ui/badge/index")['Badge']
    'UiButton': typeof import("../components/ui/button/index")['Button']
    'UiCommand': typeof import("../components/ui/command/index")['Command']
    'UiCommandDialog': typeof import("../components/ui/command/index")['CommandDialog']
    'UiCommandEmpty': typeof import("../components/ui/command/index")['CommandEmpty']
    'UiCommandGroup': typeof import("../components/ui/command/index")['CommandGroup']
    'UiCommandInput': typeof import("../components/ui/command/index")['CommandInput']
    'UiCommandItem': typeof import("../components/ui/command/index")['CommandItem']
    'UiCommandList': typeof import("../components/ui/command/index")['CommandList']
    'UiCommandSeparator': typeof import("../components/ui/command/index")['CommandSeparator']
    'UiCommandShortcut': typeof import("../components/ui/command/index")['CommandShortcut']
    'UiLabel': typeof import("../components/ui/label/index")['Label']
    'UiDialog': typeof import("../components/ui/dialog/index")['Dialog']
    'UiDialogClose': typeof import("../components/ui/dialog/index")['DialogClose']
    'UiDialogContent': typeof import("../components/ui/dialog/index")['DialogContent']
    'UiDialogDescription': typeof import("../components/ui/dialog/index")['DialogDescription']
    'UiDialogFooter': typeof import("../components/ui/dialog/index")['DialogFooter']
    'UiDialogHeader': typeof import("../components/ui/dialog/index")['DialogHeader']
    'UiDialogScrollContent': typeof import("../components/ui/dialog/index")['DialogScrollContent']
    'UiDialogTitle': typeof import("../components/ui/dialog/index")['DialogTitle']
    'UiDialogTrigger': typeof import("../components/ui/dialog/index")['DialogTrigger']
    'UiCard': typeof import("../components/ui/card/index")['Card']
    'UiCardContent': typeof import("../components/ui/card/index")['CardContent']
    'UiCardDescription': typeof import("../components/ui/card/index")['CardDescription']
    'UiCardFooter': typeof import("../components/ui/card/index")['CardFooter']
    'UiCardHeader': typeof import("../components/ui/card/index")['CardHeader']
    'UiCardTitle': typeof import("../components/ui/card/index")['CardTitle']
    'UiPopover': typeof import("../components/ui/popover/index")['Popover']
    'UiPopoverContent': typeof import("../components/ui/popover/index")['PopoverContent']
    'UiPopoverTrigger': typeof import("../components/ui/popover/index")['PopoverTrigger']
    'UiPopoverAnchor': typeof import("../components/ui/popover/index")['PopoverAnchor']
    'UiInput': typeof import("../components/ui/input/index")['Input']
    'UiSelect': typeof import("../components/ui/select/index")['Select']
    'UiSelectContent': typeof import("../components/ui/select/index")['SelectContent']
    'UiSelectGroup': typeof import("../components/ui/select/index")['SelectGroup']
    'UiSelectItem': typeof import("../components/ui/select/index")['SelectItem']
    'UiSelectItemText': typeof import("../components/ui/select/index")['SelectItemText']
    'UiSelectLabel': typeof import("../components/ui/select/index")['SelectLabel']
    'UiSelectScrollDownButton': typeof import("../components/ui/select/index")['SelectScrollDownButton']
    'UiSelectScrollUpButton': typeof import("../components/ui/select/index")['SelectScrollUpButton']
    'UiSelectSeparator': typeof import("../components/ui/select/index")['SelectSeparator']
    'UiSelectTrigger': typeof import("../components/ui/select/index")['SelectTrigger']
    'UiSelectValue': typeof import("../components/ui/select/index")['SelectValue']
    'UiSheet': typeof import("../components/ui/sheet/index")['Sheet']
    'UiSheetClose': typeof import("../components/ui/sheet/index")['SheetClose']
    'UiSheetContent': typeof import("../components/ui/sheet/index")['SheetContent']
    'UiSheetDescription': typeof import("../components/ui/sheet/index")['SheetDescription']
    'UiSheetFooter': typeof import("../components/ui/sheet/index")['SheetFooter']
    'UiSheetHeader': typeof import("../components/ui/sheet/index")['SheetHeader']
    'UiSheetTitle': typeof import("../components/ui/sheet/index")['SheetTitle']
    'UiSheetTrigger': typeof import("../components/ui/sheet/index")['SheetTrigger']
    'UiSeparator': typeof import("../components/ui/separator/index")['Separator']
    'UiTabs': typeof import("../components/ui/tabs/index")['Tabs']
    'UiTabsContent': typeof import("../components/ui/tabs/index")['TabsContent']
    'UiTabsList': typeof import("../components/ui/tabs/index")['TabsList']
    'UiTabsTrigger': typeof import("../components/ui/tabs/index")['TabsTrigger']
    'ColorScheme': typeof import("../node_modules/.pnpm/@nuxtjs+color-mode@3.5.2_magicast@0.3.5/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
    'NuxtPage': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/pages/runtime/page")['default']
    'NoScript': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['NoScript']
    'Link': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Link']
    'Base': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Base']
    'Title': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Title']
    'Meta': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Meta']
    'Style': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Style']
    'Head': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Head']
    'Html': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Html']
    'Body': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Body']
    'NuxtIsland': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-island")['default']
    'NuxtRouteAnnouncer': typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/server-placeholder")['default']
      'LazyConfirmationDialog': LazyComponent<typeof import("../components/ConfirmationDialog.vue")['default']>
    'LazyStatCard': LazyComponent<typeof import("../components/StatCard.vue")['default']>
    'LazyThemeToggle': LazyComponent<typeof import("../components/ThemeToggle.vue")['default']>
    'LazyWelcomeMessage': LazyComponent<typeof import("../components/WelcomeMessage.vue")['default']>
    'LazyTransactionDialog': LazyComponent<typeof import("../components/transaction/TransactionDialog.vue")['default']>
    'LazyTransactionTableRow': LazyComponent<typeof import("../components/transaction/TransactionTableRow.vue")['default']>
    'LazyNuxtWelcome': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
    'LazyNuxtLayout': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
    'LazyNuxtErrorBoundary': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
    'LazyClientOnly': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/client-only")['default']>
    'LazyDevOnly': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/dev-only")['default']>
    'LazyServerPlaceholder': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
    'LazyNuxtLink': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
    'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
    'LazyNuxtTime': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
    'LazyNuxtImg': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
    'LazyNuxtPicture': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
    'LazyUiAvatar': LazyComponent<typeof import("../components/ui/avatar/index")['Avatar']>
    'LazyUiAvatarFallback': LazyComponent<typeof import("../components/ui/avatar/index")['AvatarFallback']>
    'LazyUiAvatarImage': LazyComponent<typeof import("../components/ui/avatar/index")['AvatarImage']>
    'LazyUiBadge': LazyComponent<typeof import("../components/ui/badge/index")['Badge']>
    'LazyUiButton': LazyComponent<typeof import("../components/ui/button/index")['Button']>
    'LazyUiCommand': LazyComponent<typeof import("../components/ui/command/index")['Command']>
    'LazyUiCommandDialog': LazyComponent<typeof import("../components/ui/command/index")['CommandDialog']>
    'LazyUiCommandEmpty': LazyComponent<typeof import("../components/ui/command/index")['CommandEmpty']>
    'LazyUiCommandGroup': LazyComponent<typeof import("../components/ui/command/index")['CommandGroup']>
    'LazyUiCommandInput': LazyComponent<typeof import("../components/ui/command/index")['CommandInput']>
    'LazyUiCommandItem': LazyComponent<typeof import("../components/ui/command/index")['CommandItem']>
    'LazyUiCommandList': LazyComponent<typeof import("../components/ui/command/index")['CommandList']>
    'LazyUiCommandSeparator': LazyComponent<typeof import("../components/ui/command/index")['CommandSeparator']>
    'LazyUiCommandShortcut': LazyComponent<typeof import("../components/ui/command/index")['CommandShortcut']>
    'LazyUiLabel': LazyComponent<typeof import("../components/ui/label/index")['Label']>
    'LazyUiDialog': LazyComponent<typeof import("../components/ui/dialog/index")['Dialog']>
    'LazyUiDialogClose': LazyComponent<typeof import("../components/ui/dialog/index")['DialogClose']>
    'LazyUiDialogContent': LazyComponent<typeof import("../components/ui/dialog/index")['DialogContent']>
    'LazyUiDialogDescription': LazyComponent<typeof import("../components/ui/dialog/index")['DialogDescription']>
    'LazyUiDialogFooter': LazyComponent<typeof import("../components/ui/dialog/index")['DialogFooter']>
    'LazyUiDialogHeader': LazyComponent<typeof import("../components/ui/dialog/index")['DialogHeader']>
    'LazyUiDialogScrollContent': LazyComponent<typeof import("../components/ui/dialog/index")['DialogScrollContent']>
    'LazyUiDialogTitle': LazyComponent<typeof import("../components/ui/dialog/index")['DialogTitle']>
    'LazyUiDialogTrigger': LazyComponent<typeof import("../components/ui/dialog/index")['DialogTrigger']>
    'LazyUiCard': LazyComponent<typeof import("../components/ui/card/index")['Card']>
    'LazyUiCardContent': LazyComponent<typeof import("../components/ui/card/index")['CardContent']>
    'LazyUiCardDescription': LazyComponent<typeof import("../components/ui/card/index")['CardDescription']>
    'LazyUiCardFooter': LazyComponent<typeof import("../components/ui/card/index")['CardFooter']>
    'LazyUiCardHeader': LazyComponent<typeof import("../components/ui/card/index")['CardHeader']>
    'LazyUiCardTitle': LazyComponent<typeof import("../components/ui/card/index")['CardTitle']>
    'LazyUiPopover': LazyComponent<typeof import("../components/ui/popover/index")['Popover']>
    'LazyUiPopoverContent': LazyComponent<typeof import("../components/ui/popover/index")['PopoverContent']>
    'LazyUiPopoverTrigger': LazyComponent<typeof import("../components/ui/popover/index")['PopoverTrigger']>
    'LazyUiPopoverAnchor': LazyComponent<typeof import("../components/ui/popover/index")['PopoverAnchor']>
    'LazyUiInput': LazyComponent<typeof import("../components/ui/input/index")['Input']>
    'LazyUiSelect': LazyComponent<typeof import("../components/ui/select/index")['Select']>
    'LazyUiSelectContent': LazyComponent<typeof import("../components/ui/select/index")['SelectContent']>
    'LazyUiSelectGroup': LazyComponent<typeof import("../components/ui/select/index")['SelectGroup']>
    'LazyUiSelectItem': LazyComponent<typeof import("../components/ui/select/index")['SelectItem']>
    'LazyUiSelectItemText': LazyComponent<typeof import("../components/ui/select/index")['SelectItemText']>
    'LazyUiSelectLabel': LazyComponent<typeof import("../components/ui/select/index")['SelectLabel']>
    'LazyUiSelectScrollDownButton': LazyComponent<typeof import("../components/ui/select/index")['SelectScrollDownButton']>
    'LazyUiSelectScrollUpButton': LazyComponent<typeof import("../components/ui/select/index")['SelectScrollUpButton']>
    'LazyUiSelectSeparator': LazyComponent<typeof import("../components/ui/select/index")['SelectSeparator']>
    'LazyUiSelectTrigger': LazyComponent<typeof import("../components/ui/select/index")['SelectTrigger']>
    'LazyUiSelectValue': LazyComponent<typeof import("../components/ui/select/index")['SelectValue']>
    'LazyUiSheet': LazyComponent<typeof import("../components/ui/sheet/index")['Sheet']>
    'LazyUiSheetClose': LazyComponent<typeof import("../components/ui/sheet/index")['SheetClose']>
    'LazyUiSheetContent': LazyComponent<typeof import("../components/ui/sheet/index")['SheetContent']>
    'LazyUiSheetDescription': LazyComponent<typeof import("../components/ui/sheet/index")['SheetDescription']>
    'LazyUiSheetFooter': LazyComponent<typeof import("../components/ui/sheet/index")['SheetFooter']>
    'LazyUiSheetHeader': LazyComponent<typeof import("../components/ui/sheet/index")['SheetHeader']>
    'LazyUiSheetTitle': LazyComponent<typeof import("../components/ui/sheet/index")['SheetTitle']>
    'LazyUiSheetTrigger': LazyComponent<typeof import("../components/ui/sheet/index")['SheetTrigger']>
    'LazyUiSeparator': LazyComponent<typeof import("../components/ui/separator/index")['Separator']>
    'LazyUiTabs': LazyComponent<typeof import("../components/ui/tabs/index")['Tabs']>
    'LazyUiTabsContent': LazyComponent<typeof import("../components/ui/tabs/index")['TabsContent']>
    'LazyUiTabsList': LazyComponent<typeof import("../components/ui/tabs/index")['TabsList']>
    'LazyUiTabsTrigger': LazyComponent<typeof import("../components/ui/tabs/index")['TabsTrigger']>
    'LazyColorScheme': LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+color-mode@3.5.2_magicast@0.3.5/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
    'LazyNuxtPage': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/pages/runtime/page")['default']>
    'LazyNoScript': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
    'LazyLink': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Link']>
    'LazyBase': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Base']>
    'LazyTitle': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Title']>
    'LazyMeta': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Meta']>
    'LazyStyle': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Style']>
    'LazyHead': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Head']>
    'LazyHtml': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Html']>
    'LazyBody': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Body']>
    'LazyNuxtIsland': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
    'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export const ConfirmationDialog: typeof import("../components/ConfirmationDialog.vue")['default']
export const StatCard: typeof import("../components/StatCard.vue")['default']
export const ThemeToggle: typeof import("../components/ThemeToggle.vue")['default']
export const WelcomeMessage: typeof import("../components/WelcomeMessage.vue")['default']
export const TransactionDialog: typeof import("../components/transaction/TransactionDialog.vue")['default']
export const TransactionTableRow: typeof import("../components/transaction/TransactionTableRow.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const UiAvatar: typeof import("../components/ui/avatar/index")['Avatar']
export const UiAvatarFallback: typeof import("../components/ui/avatar/index")['AvatarFallback']
export const UiAvatarImage: typeof import("../components/ui/avatar/index")['AvatarImage']
export const UiBadge: typeof import("../components/ui/badge/index")['Badge']
export const UiButton: typeof import("../components/ui/button/index")['Button']
export const UiCommand: typeof import("../components/ui/command/index")['Command']
export const UiCommandDialog: typeof import("../components/ui/command/index")['CommandDialog']
export const UiCommandEmpty: typeof import("../components/ui/command/index")['CommandEmpty']
export const UiCommandGroup: typeof import("../components/ui/command/index")['CommandGroup']
export const UiCommandInput: typeof import("../components/ui/command/index")['CommandInput']
export const UiCommandItem: typeof import("../components/ui/command/index")['CommandItem']
export const UiCommandList: typeof import("../components/ui/command/index")['CommandList']
export const UiCommandSeparator: typeof import("../components/ui/command/index")['CommandSeparator']
export const UiCommandShortcut: typeof import("../components/ui/command/index")['CommandShortcut']
export const UiLabel: typeof import("../components/ui/label/index")['Label']
export const UiDialog: typeof import("../components/ui/dialog/index")['Dialog']
export const UiDialogClose: typeof import("../components/ui/dialog/index")['DialogClose']
export const UiDialogContent: typeof import("../components/ui/dialog/index")['DialogContent']
export const UiDialogDescription: typeof import("../components/ui/dialog/index")['DialogDescription']
export const UiDialogFooter: typeof import("../components/ui/dialog/index")['DialogFooter']
export const UiDialogHeader: typeof import("../components/ui/dialog/index")['DialogHeader']
export const UiDialogScrollContent: typeof import("../components/ui/dialog/index")['DialogScrollContent']
export const UiDialogTitle: typeof import("../components/ui/dialog/index")['DialogTitle']
export const UiDialogTrigger: typeof import("../components/ui/dialog/index")['DialogTrigger']
export const UiCard: typeof import("../components/ui/card/index")['Card']
export const UiCardContent: typeof import("../components/ui/card/index")['CardContent']
export const UiCardDescription: typeof import("../components/ui/card/index")['CardDescription']
export const UiCardFooter: typeof import("../components/ui/card/index")['CardFooter']
export const UiCardHeader: typeof import("../components/ui/card/index")['CardHeader']
export const UiCardTitle: typeof import("../components/ui/card/index")['CardTitle']
export const UiPopover: typeof import("../components/ui/popover/index")['Popover']
export const UiPopoverContent: typeof import("../components/ui/popover/index")['PopoverContent']
export const UiPopoverTrigger: typeof import("../components/ui/popover/index")['PopoverTrigger']
export const UiPopoverAnchor: typeof import("../components/ui/popover/index")['PopoverAnchor']
export const UiInput: typeof import("../components/ui/input/index")['Input']
export const UiSelect: typeof import("../components/ui/select/index")['Select']
export const UiSelectContent: typeof import("../components/ui/select/index")['SelectContent']
export const UiSelectGroup: typeof import("../components/ui/select/index")['SelectGroup']
export const UiSelectItem: typeof import("../components/ui/select/index")['SelectItem']
export const UiSelectItemText: typeof import("../components/ui/select/index")['SelectItemText']
export const UiSelectLabel: typeof import("../components/ui/select/index")['SelectLabel']
export const UiSelectScrollDownButton: typeof import("../components/ui/select/index")['SelectScrollDownButton']
export const UiSelectScrollUpButton: typeof import("../components/ui/select/index")['SelectScrollUpButton']
export const UiSelectSeparator: typeof import("../components/ui/select/index")['SelectSeparator']
export const UiSelectTrigger: typeof import("../components/ui/select/index")['SelectTrigger']
export const UiSelectValue: typeof import("../components/ui/select/index")['SelectValue']
export const UiSheet: typeof import("../components/ui/sheet/index")['Sheet']
export const UiSheetClose: typeof import("../components/ui/sheet/index")['SheetClose']
export const UiSheetContent: typeof import("../components/ui/sheet/index")['SheetContent']
export const UiSheetDescription: typeof import("../components/ui/sheet/index")['SheetDescription']
export const UiSheetFooter: typeof import("../components/ui/sheet/index")['SheetFooter']
export const UiSheetHeader: typeof import("../components/ui/sheet/index")['SheetHeader']
export const UiSheetTitle: typeof import("../components/ui/sheet/index")['SheetTitle']
export const UiSheetTrigger: typeof import("../components/ui/sheet/index")['SheetTrigger']
export const UiSeparator: typeof import("../components/ui/separator/index")['Separator']
export const UiTabs: typeof import("../components/ui/tabs/index")['Tabs']
export const UiTabsContent: typeof import("../components/ui/tabs/index")['TabsContent']
export const UiTabsList: typeof import("../components/ui/tabs/index")['TabsList']
export const UiTabsTrigger: typeof import("../components/ui/tabs/index")['TabsTrigger']
export const ColorScheme: typeof import("../node_modules/.pnpm/@nuxtjs+color-mode@3.5.2_magicast@0.3.5/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']
export const NuxtPage: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/pages/runtime/page")['default']
export const NoScript: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const LazyConfirmationDialog: LazyComponent<typeof import("../components/ConfirmationDialog.vue")['default']>
export const LazyStatCard: LazyComponent<typeof import("../components/StatCard.vue")['default']>
export const LazyThemeToggle: LazyComponent<typeof import("../components/ThemeToggle.vue")['default']>
export const LazyWelcomeMessage: LazyComponent<typeof import("../components/WelcomeMessage.vue")['default']>
export const LazyTransactionDialog: LazyComponent<typeof import("../components/transaction/TransactionDialog.vue")['default']>
export const LazyTransactionTableRow: LazyComponent<typeof import("../components/transaction/TransactionTableRow.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyUiAvatar: LazyComponent<typeof import("../components/ui/avatar/index")['Avatar']>
export const LazyUiAvatarFallback: LazyComponent<typeof import("../components/ui/avatar/index")['AvatarFallback']>
export const LazyUiAvatarImage: LazyComponent<typeof import("../components/ui/avatar/index")['AvatarImage']>
export const LazyUiBadge: LazyComponent<typeof import("../components/ui/badge/index")['Badge']>
export const LazyUiButton: LazyComponent<typeof import("../components/ui/button/index")['Button']>
export const LazyUiCommand: LazyComponent<typeof import("../components/ui/command/index")['Command']>
export const LazyUiCommandDialog: LazyComponent<typeof import("../components/ui/command/index")['CommandDialog']>
export const LazyUiCommandEmpty: LazyComponent<typeof import("../components/ui/command/index")['CommandEmpty']>
export const LazyUiCommandGroup: LazyComponent<typeof import("../components/ui/command/index")['CommandGroup']>
export const LazyUiCommandInput: LazyComponent<typeof import("../components/ui/command/index")['CommandInput']>
export const LazyUiCommandItem: LazyComponent<typeof import("../components/ui/command/index")['CommandItem']>
export const LazyUiCommandList: LazyComponent<typeof import("../components/ui/command/index")['CommandList']>
export const LazyUiCommandSeparator: LazyComponent<typeof import("../components/ui/command/index")['CommandSeparator']>
export const LazyUiCommandShortcut: LazyComponent<typeof import("../components/ui/command/index")['CommandShortcut']>
export const LazyUiLabel: LazyComponent<typeof import("../components/ui/label/index")['Label']>
export const LazyUiDialog: LazyComponent<typeof import("../components/ui/dialog/index")['Dialog']>
export const LazyUiDialogClose: LazyComponent<typeof import("../components/ui/dialog/index")['DialogClose']>
export const LazyUiDialogContent: LazyComponent<typeof import("../components/ui/dialog/index")['DialogContent']>
export const LazyUiDialogDescription: LazyComponent<typeof import("../components/ui/dialog/index")['DialogDescription']>
export const LazyUiDialogFooter: LazyComponent<typeof import("../components/ui/dialog/index")['DialogFooter']>
export const LazyUiDialogHeader: LazyComponent<typeof import("../components/ui/dialog/index")['DialogHeader']>
export const LazyUiDialogScrollContent: LazyComponent<typeof import("../components/ui/dialog/index")['DialogScrollContent']>
export const LazyUiDialogTitle: LazyComponent<typeof import("../components/ui/dialog/index")['DialogTitle']>
export const LazyUiDialogTrigger: LazyComponent<typeof import("../components/ui/dialog/index")['DialogTrigger']>
export const LazyUiCard: LazyComponent<typeof import("../components/ui/card/index")['Card']>
export const LazyUiCardContent: LazyComponent<typeof import("../components/ui/card/index")['CardContent']>
export const LazyUiCardDescription: LazyComponent<typeof import("../components/ui/card/index")['CardDescription']>
export const LazyUiCardFooter: LazyComponent<typeof import("../components/ui/card/index")['CardFooter']>
export const LazyUiCardHeader: LazyComponent<typeof import("../components/ui/card/index")['CardHeader']>
export const LazyUiCardTitle: LazyComponent<typeof import("../components/ui/card/index")['CardTitle']>
export const LazyUiPopover: LazyComponent<typeof import("../components/ui/popover/index")['Popover']>
export const LazyUiPopoverContent: LazyComponent<typeof import("../components/ui/popover/index")['PopoverContent']>
export const LazyUiPopoverTrigger: LazyComponent<typeof import("../components/ui/popover/index")['PopoverTrigger']>
export const LazyUiPopoverAnchor: LazyComponent<typeof import("../components/ui/popover/index")['PopoverAnchor']>
export const LazyUiInput: LazyComponent<typeof import("../components/ui/input/index")['Input']>
export const LazyUiSelect: LazyComponent<typeof import("../components/ui/select/index")['Select']>
export const LazyUiSelectContent: LazyComponent<typeof import("../components/ui/select/index")['SelectContent']>
export const LazyUiSelectGroup: LazyComponent<typeof import("../components/ui/select/index")['SelectGroup']>
export const LazyUiSelectItem: LazyComponent<typeof import("../components/ui/select/index")['SelectItem']>
export const LazyUiSelectItemText: LazyComponent<typeof import("../components/ui/select/index")['SelectItemText']>
export const LazyUiSelectLabel: LazyComponent<typeof import("../components/ui/select/index")['SelectLabel']>
export const LazyUiSelectScrollDownButton: LazyComponent<typeof import("../components/ui/select/index")['SelectScrollDownButton']>
export const LazyUiSelectScrollUpButton: LazyComponent<typeof import("../components/ui/select/index")['SelectScrollUpButton']>
export const LazyUiSelectSeparator: LazyComponent<typeof import("../components/ui/select/index")['SelectSeparator']>
export const LazyUiSelectTrigger: LazyComponent<typeof import("../components/ui/select/index")['SelectTrigger']>
export const LazyUiSelectValue: LazyComponent<typeof import("../components/ui/select/index")['SelectValue']>
export const LazyUiSheet: LazyComponent<typeof import("../components/ui/sheet/index")['Sheet']>
export const LazyUiSheetClose: LazyComponent<typeof import("../components/ui/sheet/index")['SheetClose']>
export const LazyUiSheetContent: LazyComponent<typeof import("../components/ui/sheet/index")['SheetContent']>
export const LazyUiSheetDescription: LazyComponent<typeof import("../components/ui/sheet/index")['SheetDescription']>
export const LazyUiSheetFooter: LazyComponent<typeof import("../components/ui/sheet/index")['SheetFooter']>
export const LazyUiSheetHeader: LazyComponent<typeof import("../components/ui/sheet/index")['SheetHeader']>
export const LazyUiSheetTitle: LazyComponent<typeof import("../components/ui/sheet/index")['SheetTitle']>
export const LazyUiSheetTrigger: LazyComponent<typeof import("../components/ui/sheet/index")['SheetTrigger']>
export const LazyUiSeparator: LazyComponent<typeof import("../components/ui/separator/index")['Separator']>
export const LazyUiTabs: LazyComponent<typeof import("../components/ui/tabs/index")['Tabs']>
export const LazyUiTabsContent: LazyComponent<typeof import("../components/ui/tabs/index")['TabsContent']>
export const LazyUiTabsList: LazyComponent<typeof import("../components/ui/tabs/index")['TabsList']>
export const LazyUiTabsTrigger: LazyComponent<typeof import("../components/ui/tabs/index")['TabsTrigger']>
export const LazyColorScheme: LazyComponent<typeof import("../node_modules/.pnpm/@nuxtjs+color-mode@3.5.2_magicast@0.3.5/node_modules/@nuxtjs/color-mode/dist/runtime/component.vue3.vue")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/pages/runtime/page")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/nuxt-island")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/.pnpm/nuxt@4.0.3_@netlify+blobs@9.1.2_@parcel+watcher@2.5.1_@types+node@24.3.0_@vue+compiler-_f43794549b85f4acd32998ca11df289b/node_modules/nuxt/dist/app/components/server-placeholder")['default']>

export const componentNames: string[]
