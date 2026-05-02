import pizza1 from "@/assets/food/pizza-1.jpg";
import pizza2 from "@/assets/food/pizza-2.jpg";
import pizza3 from "@/assets/food/pizza-3.jpg";
import pizza4 from "@/assets/food/pizza-4.jpg";
import pasta1 from "@/assets/food/pasta-1.jpg";
import pasta2 from "@/assets/food/pasta-2.jpg";
import pasta3 from "@/assets/food/pasta-3.jpg";
import pasta4 from "@/assets/food/pasta-4.jpg";
import grill1 from "@/assets/food/grill-1.jpg";
import grill2 from "@/assets/food/grill-2.jpg";
import grill3 from "@/assets/food/grill-3.jpg";
import grill4 from "@/assets/food/grill-4.jpg";
import sandwich1 from "@/assets/food/sandwich-1.jpg";
import sandwich2 from "@/assets/food/sandwich-2.jpg";
import sandwich3 from "@/assets/food/sandwich-3.jpg";
import sandwich4 from "@/assets/food/sandwich-4.jpg";
import burger1 from "@/assets/food/burger-1.jpg";
import burger2 from "@/assets/food/burger-2.jpg";
import burger3 from "@/assets/food/burger-3.jpg";
import burger4 from "@/assets/food/burger-4.jpg";
import dessert1 from "@/assets/food/dessert-1.jpg";
import dessert2 from "@/assets/food/dessert-2.jpg";
import dessert3 from "@/assets/food/dessert-3.jpg";
import dessert4 from "@/assets/food/dessert-4.jpg";

export interface MenuItem {
  name: { en: string; ar: string };
  desc: { en: string; ar: string };
  price: number;
  image: string;
}

export interface Category {
  id: string;
  key: string; // translation key
  items: MenuItem[];
}

export const CATEGORIES: Category[] = [
  {
    id: "pizza",
    key: "cat.pizza",
    items: [
      { name: { en: "Margherita Reale", ar: "مارغريتا الملوكية" }, desc: { en: "San Marzano, mozzarella, basil, sea crust.", ar: "سان مارزانو، موزاريلا، ريحان، عجينة بحرية." }, price: 18, image: pizza1 },
      { name: { en: "Tartufo Nero", ar: "ترتوفو نيرو" }, desc: { en: "Black truffle, mushrooms, thyme, creamy cheese.", ar: "كمأ أسود، فطر بري، زعتر، جبن." }, price: 28, image: pizza2 },
      { name: { en: "Prosciutto e Rucola", ar: "بروشوتو وجرجير" }, desc: { en: "Prosciutto, arugula, parmesan, balanced richness.", ar: "بروشوتو، جرجير، بارميزان، نكهة متوازنة." }, price: 24, image: pizza3 },
      { name: { en: "Quattro Formaggi", ar: "أربع أجبان" }, desc: { en: "Four cheeses, melted layers, rich harmony.", ar: "أربع أجبان، طبقات ذائبة، انسجام غني." }, price: 22, image: pizza4 },
    ],
  },
  {
    id: "pasta",
    key: "cat.pasta",
    items: [
      { name: { en: "Carbonara Classica", ar: "كاربونارا كلاسيكا" }, desc: { en: "Spaghetti, guanciale, yolk, pepper perfection.", ar: "سباغيتي، غوانشيالي، صفار، فلفل مثالي." }, price: 22, image: pasta1 },
      { name: { en: "Tagliatelle al Tartufo", ar: "تالياتيلي بالكمأ" }, desc: { en: "Tagliatelle, truffle, butter, parmesan elegance.", ar: "تالياتيلي، كمأ، زبدة، بارميزان فاخر." }, price: 32, image: pasta2 },
      { name: { en: "Linguine ai Frutti di Mare", ar: "لينجويني بثمار البحر" }, desc: { en: "Seafood linguine, herbs, chili brightness.", ar: "لينجويني بحري، أعشاب، فلفل منعش." }, price: 28, image: pasta3 },
      { name: { en: "Pappardelle al Ragù", ar: "بابارديلي بالراغو" }, desc: { en: "Braised beef, red wine, parmesan depth.", ar: "لحم بطيء، نبيذ، بارميزان عميق." }, price: 26, image: pasta4 },
    ],
  },
  {
    id: "grill",
    key: "cat.grill",
    items: [
      { name: { en: "Wagyu Ribeye", ar: "ريب آي واغيو" }, desc: { en: "Wagyu, embers, rosemary, smoked salt.", ar: "واغيو، جمر، روزماري، ملح مدخن." }, price: 78, image: grill1 },
      { name: { en: "Lamb Cutlets", ar: "ريش الخروف" }, desc: { en: "Tender lamb, mint, charred shallots.", ar: "لحم طري، نعناع، بصل مشوي." }, price: 42, image: grill2 },
      { name: { en: "Norwegian Salmon", ar: "سلمون نرويجي" }, desc: { en: "Salmon, dill butter, cedar aroma.", ar: "سلمون، زبدة شبت، رائحة أرز." }, price: 36, image: grill3 },
      { name: { en: "Chicken Skewers", ar: "أسياخ دجاج" }, desc: { en: "Saffron chicken, vegetables, spicy harissa.", ar: "دجاج زعفران، خضار، هريسة حارة." }, price: 24, image: grill4 },
    ],
  },
  {
    id: "sandwiches",
    key: "cat.sandwiches",
    items: [
      { name: { en: "Maison Club", ar: "كلوب ميزون" }, desc: { en: "Smoked chicken, bacon, lettuce, brioche.", ar: "دجاج مدخن، بيكون، خس، بريوش." }, price: 18, image: sandwich1 },
      { name: { en: "Steak Ciabatta", ar: "ستيك تشاباتا" }, desc: { en: "Ribeye, onions, horseradish, ciabatta.", ar: "ريب آي، بصل، فجل، تشاباتا." }, price: 22, image: sandwich2 },
      { name: { en: "Caprese Pressé", ar: "كابريزي بريسيه" }, desc: { en: "Mozzarella, tomato, basil, sourdough.", ar: "موزاريلا، طماطم، ريحان، خبز." }, price: 16, image: sandwich3 },
      { name: { en: "Brisket Brioche", ar: "بريسكت بريوش" }, desc: { en: "Slow brisket, glaze, pickled onion.", ar: "بريسكت بطيء، صلصة، بصل مخلل." }, price: 20, image: sandwich4 },
    ],
  },
  {
    id: "burgers",
    key: "cat.burgers",
    items: [
      { name: { en: "Maison Wagyu", ar: "ميزون واغيو" }, desc: { en: "Wagyu, cheddar, sauce, brioche.", ar: "واغيو، شيدر، صلصة، بريوش." }, price: 28, image: burger1 },
      { name: { en: "Truffle Mushroom", ar: "كمأ وفطر" }, desc: { en: "Beef, truffle, mushrooms, fontina.", ar: "لحم، كمأ، فطر، فونتينا." }, price: 26, image: burger2 },
      { name: { en: "Smash Double", ar: "سماش دبل" }, desc: { en: "Double patties, cheese, bacon, sauce.", ar: "قطعتان، جبن، بيكون، صلصة." }, price: 22, image: burger3 },
      { name: { en: "Crispy Chicken", ar: "دجاج مقرمش" }, desc: { en: "Crispy chicken, slaw, honey brioche.", ar: "دجاج مقرمش، سلو، عسل بريوش." }, price: 19, image: burger4 },
    ],
  },
  {
    id: "desserts",
    key: "cat.desserts",
    items: [
      { name: { en: "Lava Noir", ar: "لافا نوار" }, desc: { en: "Dark chocolate, vanilla, molten center.", ar: "شوكولاتة داكنة، فانيليا، قلب سائل." }, price: 14, image: dessert1 },
      { name: { en: "Tiramisù della Casa", ar: "تيراميسو البيت" }, desc: { en: "Mascarpone, espresso, cocoa indulgence.", ar: "ماسكاربوني، إسبريسو، كاكاو فاخر." }, price: 12, image: dessert2 },
      { name: { en: "Crème Brûlée", ar: "كريم بروليه" }, desc: { en: "Vanilla custard, caramel, berry finish.", ar: "كاسترد فانيليا، كراميل، توت." }, price: 12, image: dessert3 },
      { name: { en: "Cheesecake Maison", ar: "تشيز كيك ميزون" }, desc: { en: "Creamy cheesecake, berry sauce, crust.", ar: "تشيز كيك، توت، قاعدة مقرمشة." }, price: 13, image: dessert4 },
    ],
  },
];
// Each category occupies a 2-page spread (left + right). Plus front cover + back cover.
// Total physical pages = 2 (cover) + categories * 2 + 2 (back) ; we'll structure simply:
// pages: [cover, ...for each cat: leftPage(items 0-1), rightPage(items 2-3), back]
export interface BookPage {
  type: "cover" | "category-left" | "category-right" | "back";
  catIndex?: number;
}

export const BOOK_PAGES: BookPage[] = [
  { type: "cover" },
  ...CATEGORIES.flatMap((_, i): BookPage[] => [
    { type: "category-left", catIndex: i },
    { type: "category-right", catIndex: i },
  ]),
  { type: "back" },
];
