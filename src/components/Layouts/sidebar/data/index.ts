import * as Icons from "../icons";

export const NAV_DATA = [
  {
    label: "ADMIN",
    roles: [1],
    items: [
      {
        title: "Dashboard",
        icon: Icons.FourCircle,
        url: "/admins/reports",
        items: [],
      },
      {
        title: "ข้อมูลพื้นฐาน",
        icon: Icons.Alphabet,
        items: [

          {
            title: "ข้อมูลพนักงาน",
            url: "/admins/information/members",
          },
        ],
      },
      {
        title: "ตั้งค่าระบบ",
        icon: Icons.PieChart,
        url: "/admins/settings",
        items: [],
      },
    ],
  },
  {
    label: "MEMBER",
    roles: [1, 2],
    items: [
      {
        title: "ข้อมูลลูกค้า",
        icon: Icons.User,
        url: "/member/users",
        items: [],
      },
       {
        title: "ข้อมูลประเภทสินค้า",
        icon: Icons.PieChart,
        url: "/member/product-type",
        items: [],
      },
       {
        title: "ข้อมูลสินค้า",
        icon: Icons.Alphabet,
        url: "/member/products",
        items: [],
      },

    ],
  },

    {
    label: "SYSTEMS",
    roles: [1,2],
    items: [
      {
        title: "ผ่อน",
        icon: Icons.ArrowLeftIcon,
        url: "/member/rent",
        items: [],
      },
            {
        title: "ไอโฟนแลกเงิน",
        icon: Icons.ArrowLeftIcon,
        url: "/member/installment",
        items: [],
      },
      
    ],
  },

  // {
  //   label: "OTHER",
  //   roles: [1, 2],
  //   items: [

  //     {
  //       title: "Dashboard",
  //       icon: Icons.HomeIcon,
  //       items: [
  //         {
  //           title: "eCommerce",
  //           url: "/",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Calendar",
  //       url: "/calendar",
  //       icon: Icons.Calendar,
  //       items: [],
  //     },
  //     {
  //       title: "Profile",
  //       url: "/profile",
  //       icon: Icons.User,
  //       items: [],
  //     },
  //     {
  //       title: "Forms",
  //       icon: Icons.Alphabet,
  //       items: [
  //         {
  //           title: "Form Elements",
  //           url: "/forms/form-elements",
  //         },
  //         {
  //           title: "Form Layout",
  //           url: "/forms/form-layout",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Tables",
  //       url: "/tables",
  //       icon: Icons.Table,
  //       items: [
  //         {
  //           title: "Tables",
  //           url: "/tables",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Pages",
  //       icon: Icons.Alphabet,
  //       items: [
  //         {
  //           title: "Settings",
  //           url: "/pages/settings",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   label: "MEMBER1",
  //   roles: [1, 2],
  //   items: [
  //     {
  //       title: "Charts",
  //       icon: Icons.PieChart,
  //       items: [
  //         {
  //           title: "Basic Chart",
  //           url: "/charts/basic-chart",
  //         },
  //       ],
  //     },
  //     {
  //       title: "UI Elements",
  //       icon: Icons.FourCircle,
  //       items: [
  //         {
  //           title: "Alerts",
  //           url: "/ui-elements/alerts",
  //         },
  //         {
  //           title: "Buttons",
  //           url: "/ui-elements/buttons",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Authentication",
  //       icon: Icons.Authentication,
  //       items: [
  //         {
  //           title: "Sign In",
  //           url: "/auth/sign-in",
  //         },
  //       ],
  //     },
  //   ],
  // },
];
