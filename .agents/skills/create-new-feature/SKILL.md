---
name: create-new-feature
description: Ky nang tao module/tinh nang moi theo chuan Feature-based, Server Actions, PermissionGuard, va strict type Prisma cua du an.
---

# Ky Nang / AI Skill: create-new-feature

Ban duoc trang bi ky nang nay de dam bao moi khi User yeu cau tao chuc nang/module quan ly moi, ban se tuan thu tuyet doi cau truc thu muc cua du an thay vi tu y code theo kieu Next.js truyen thong.

## Muc tieu cot loi
1. Kien truc Feature-Based: moi dong code lien quan den mot tinh nang phai duoc gom vao 1 folder duy nhat trong `src/features/[ten-tinh-nang]/`.
2. Server Actions First: khong dung API Route (`/api/`). Database fetch / mutate phai lam bang Server Actions ket hop Prisma.
3. Authorization Guard: toan bo UI, page, button, va thao tac quan trong bat buoc phai duoc boc bang `<PermissionGuard>` dung muc quyen.
4. Strict Prisma Types: moi type nghiep vu phai extend tu Prisma model, khong duoc duplicate field da co trong schema.

## Quy trinh thuc hien tron goi (6 buoc)

Bat cu khi nao tao tinh nang moi, hay lam dung thu tu sau:

### Buoc 1: Khai bao Module (Phan quyen)
Mo file `src/lib/permissions.ts` va them tinh nang do vao mang `MODULES`:

```typescript
{ key: "dat-hang", label: "Dat mua hang", group: "Hang hoa & Kho" }
```

Hanh dong nay giup man hinh phan quyen tu dong co cong tac bat/tat quyen cho module nay.

### Buoc 2: Dung kho Feature
Tao thu muc `src/features/[ten-tinh-nang]` va chia file:
- `schema.ts`: khai bao Zod schema, input schema, validation schema.
- `action.ts`: dat `"use server"` len tren cung. Code Prisma thao tac DB. Nho them `revalidatePath('/[ten-tinh-nang]')` o cuoi moi ham tao/sua/xoa.
- `types.ts`: bat buoc khai bao business types bang cach extend tu Prisma models.
- `components/[Ten]Client.tsx`: giao dien client chinh cho table list, dialog, form, interactions.

### Buoc 3: Ap dung Guard o Client Component
Trong giao dien client (`/components/`), can su dung guard:

```tsx
<PermissionGuard moduleKey="[ten-tinh-nang]" level="add">
    <button>Them moi</button>
</PermissionGuard>
```

Neu can check logic trong JS, import hook:

```tsx
const { canManage, canAdd, canEdit, canDelete } = usePermissions();
canAdd("[ten-tinh-nang]");
```

### Buoc 4: Tao App Route
Tao `src/app/(dashboard)/[ten-tinh-nang]/page.tsx` va chi dung Server Component:
- Import va goi cac ham fetch data tu `action.ts`.
- Render `<[Ten]Client />` tai day.
- Boc toan bo trang bang quyen view de cam truy cap truc tiep:

```tsx
<PermissionGuard moduleKey="[ten-tinh-nang]" level="view" showNoAccess>
    <[Ten]Client data={data} />
</PermissionGuard>
```

### Buoc 5: Cap nhat Sidebar
Mo file `src/config/sidebar-menu.ts` va them item vao nhom phu hop trong `sidebarMenuGroups`:

```typescript
{
    title: "Ten tinh nang",
    url: "/[ten-tinh-nang]",
    icon: IconComponent,
    moduleKey: "[ten-tinh-nang]",
}
```

Tuyet doi khong quen `moduleKey`, vi no duoc dung de kiem tra `canView()` va an/hien menu theo quyen user.

### Buoc 6: Cap nhat Dashboard Grid
Mo `src/app/(dashboard)/dashboard/page.tsx` va them module vao `moduleGroups`:

```typescript
{
    name: "Ten tinh nang",
    description: "Mo ta...",
    href: "/[ten-tinh-nang]",
    icon: IconComponent,
    color: "text-[mau]-600",
    bgColor: "bg-[mau]-50 dark:bg-[mau]-950/50",
    available: true,
    moduleKey: "[ten-tinh-nang]",
}
```

Chi can dat dung `moduleKey` la dashboard se loc hien thi dung theo `canView()`.

## Quy tac strict cho `types.ts`

### Nguyen tac bat buoc
- Luon import type tu `@prisma/client`.
- Type nghiep vu phai extend tu model Prisma goc.
- Moi field da co trong model Prisma phai lay tu model do, khong duoc khai bao lai thu cong.
- Chi duoc them field business, field tinh toan, field tong hop, hoac nested relation mo rong khong ton tai san trong schema.
- Ten type phai dat theo pattern `Primary + Business`, vi du: `XNTKho`.

### Mau dung

```typescript
import {
    DanhMucHangHoa,
    GiaBan,
    GiaNhap,
    XuatNhapKho,
    ChiTietXNK,
} from "@prisma/client";

export type XNTKho = DanhMucHangHoa & {
    giaBan: GiaBan[];
    giaNhap: GiaNhap[];
    chiTietXNK: (ChiTietXNK & { xnk: XuatNhapKho })[];
    tonDauKy: {
        soLuong: number;
        donGia: number;
        thanhTien: number;
    };
    nhapTrongKy: {
        soLuong: number;
        thanhTien: number;
    };
    xuatTrongKy: {
        soLuong: number;
        doanhSo: number;
        giaVon: number;
    };
    tonCuoiKyTongHop: {
        soLuong: number;
        donGia: number;
        thanhTien: number;
    };
};
```

### Mau sai

```typescript
export type XNTKho = {
    id: string;
    name: string;
    maHang: string;
};
```

Sai vi dang duplicate field da ton tai trong Prisma model thay vi extend model goc.

## Cam ky tuyet doi khi lam feature moi
- Cam tao thu muc phan manh nhu `src/components/[ten-tinh-nang]` tru cac shared component dung chung.
- Cam bo quen `<PermissionGuard>` khoi page, button, hoac action quan trong.
- Cam fetch data o client bang `useEffect()` cho luong data chinh cua page.
- Cam dung API routes cho internal CRUD neu co the dung Server Actions.
- Cam tao custom type bang cach viet lai toan bo field cua Prisma model.
- Cam dat ten type mo ho hoac khong gan voi business context neu da co ten chuan theo domain.
- Cam sua truc tiep object Prisma da truyen qua client roi xem no nhu local source of truth. Hay thong qua action, form, va revalidate dung flow.
