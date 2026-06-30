<?php

namespace Database\Seeders;

use App\Models\CmsHeroSlide;
use App\Models\CmsNavItem;
use App\Models\CmsPage;
use Illuminate\Database\Seeder;

class CmsSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedNavigation();
        $this->seedHeroSlides();
        $this->seedPages();
    }

    private function seedNavigation(): void
    {
        if (CmsNavItem::query()->exists()) {
            return;
        }

        $home = CmsNavItem::create([
            'label' => ['fr' => 'Accueil', 'en' => 'Home', 'ar' => 'الرئيسية'],
            'route' => 'home',
            'sort_order' => 1,
        ]);

        $cqpm = CmsNavItem::create([
            'label' => ['fr' => 'CQPM', 'en' => 'CQPM', 'ar' => 'CQPM'],
            'route' => 'presentation',
            'sort_order' => 2,
        ]);

        foreach ([
            ['fr' => 'Présentation', 'en' => 'Presentation', 'ar' => 'التقديم', 'route' => 'presentation', 'order' => 1],
            ['fr' => 'Mot du Directeur', 'en' => "Director's Message", 'ar' => 'كلمة المدير', 'route' => 'director', 'order' => 2],
            ['fr' => 'Organigramme et infrastructures', 'en' => 'Infrastructure', 'ar' => 'البنية التحتية', 'route' => 'infrastructure', 'order' => 3],
            ['fr' => 'CQPM en chiffres', 'en' => 'CQPM in Numbers', 'ar' => 'CQPM بالأرقام', 'route' => 'numbers', 'order' => 4],
        ] as $item) {
            CmsNavItem::create([
                'parent_id' => $cqpm->id,
                'label' => ['fr' => $item['fr'], 'en' => $item['en'], 'ar' => $item['ar']],
                'route' => $item['route'],
                'sort_order' => $item['order'],
            ]);
        }

        $training = CmsNavItem::create([
            'label' => ['fr' => 'Formation', 'en' => 'Training', 'ar' => 'التكوين'],
            'route' => 'fishery',
            'sort_order' => 3,
        ]);

        foreach ([
            ['fr' => 'Filière Pêche', 'en' => 'Fishery Program', 'ar' => 'شعبة الصيد', 'route' => 'fishery', 'order' => 1],
            ['fr' => 'Filière Machine', 'en' => 'Engine Program', 'ar' => 'شعبة المحركات', 'route' => 'machine', 'order' => 2],
            ['fr' => 'Admission', 'en' => 'Admission', 'ar' => 'القبول', 'route' => 'formation/admission', 'order' => 3],
            ['fr' => 'Règlement intérieur', 'en' => 'Regulations', 'ar' => 'النظام الداخلي', 'route' => 'formation/reglement', 'order' => 4],
        ] as $item) {
            CmsNavItem::create([
                'parent_id' => $training->id,
                'label' => ['fr' => $item['fr'], 'en' => $item['en'], 'ar' => $item['ar']],
                'route' => $item['route'],
                'sort_order' => $item['order'],
            ]);
        }

        $news = CmsNavItem::create([
            'label' => ['fr' => 'Actualités', 'en' => 'News', 'ar' => 'الأخبار'],
            'route' => 'events',
            'sort_order' => 4,
        ]);

        foreach ([
            ['fr' => 'Galerie', 'en' => 'Gallery', 'ar' => 'المعرض', 'route' => 'gallery', 'order' => 1],
            ['fr' => 'Événements', 'en' => 'Events', 'ar' => 'الفعاليات', 'route' => 'events', 'order' => 2],
        ] as $item) {
            CmsNavItem::create([
                'parent_id' => $news->id,
                'label' => ['fr' => $item['fr'], 'en' => $item['en'], 'ar' => $item['ar']],
                'route' => $item['route'],
                'sort_order' => $item['order'],
            ]);
        }

        CmsNavItem::create([
            'label' => ['fr' => 'Contact', 'en' => 'Contact', 'ar' => 'اتصل بنا'],
            'route' => 'contact',
            'sort_order' => 5,
        ]);
    }

    private function seedHeroSlides(): void
    {
        if (CmsHeroSlide::query()->exists()) {
            return;
        }

        $slides = [
            ['src' => 'https://www.investopedia.com/thmb/r3bRD8pKXa-_dXRWZ_zXl6-igaY=/4048x2699/filters:fill(auto,1)/aerial-view-of-container-ship-transporting-goods-sailing-across-ocean-leaving-the-port-990280300-934f4cbf67354ca3bed647bed8fea783.jpg', 'alt' => ['fr' => 'Navire porte-conteneurs', 'en' => 'Container ship', 'ar' => 'سفينة حاويات']],
            ['src' => 'https://i.pinimg.com/originals/60/6e/44/606e44193b313fa20443090400c2f39b.gif', 'alt' => ['fr' => 'Formation maritime', 'en' => 'Maritime training', 'ar' => 'تكوين بحري']],
            ['src' => 'https://scontent.faga1-2.fna.fbcdn.net/v/t39.30808-6/360084207_723107303158045_1482361516111223301_n.jpg', 'alt' => ['fr' => 'CQPM Nador', 'en' => 'CQPM Nador', 'ar' => 'CQPM Nador']],
        ];

        foreach ($slides as $index => $slide) {
            CmsHeroSlide::create([
                'image_path' => $slide['src'],
                'alt' => $slide['alt'],
                'sort_order' => $index + 1,
                'is_active' => true,
            ]);
        }
    }

    private function seedPages(): void
    {
        $pages = [
            'presentation' => [
                'fr' => ['eyebrow' => 'CQPM Nador', 'title' => 'Présentation', 'intro' => 'Centre de Qualification Professionnelle Maritime'],
                'en' => ['eyebrow' => 'CQPM Nador', 'title' => 'Presentation', 'intro' => 'Professional Maritime Qualification Center'],
                'ar' => ['eyebrow' => 'CQPM Nador', 'title' => 'التقديم', 'intro' => 'مركز التأهيل المهني البحري'],
            ],
            'contact' => [
                'fr' => ['eyebrow' => 'Contact', 'title' => 'Contactez-nous', 'intro' => 'Notre équipe est à votre disposition.'],
                'en' => ['eyebrow' => 'Contact', 'title' => 'Contact Us', 'intro' => 'Our team is at your service.'],
                'ar' => ['eyebrow' => 'اتصل بنا', 'title' => 'اتصل بنا', 'intro' => 'فريقنا رهن إشارتكم.'],
            ],
            'formation/reglement' => [
                'fr' => ['eyebrow' => 'Formation', 'title' => 'Règlement intérieur', 'intro' => 'Document officiel du centre.'],
                'en' => ['eyebrow' => 'Training', 'title' => 'Internal Regulations', 'intro' => 'Official center document.'],
                'ar' => ['eyebrow' => 'التكوين', 'title' => 'النظام الداخلي', 'intro' => 'وثيقة رسمية للمركز.'],
            ],
        ];

        foreach ($pages as $slug => $locales) {
            $content = [];
            foreach ($locales as $lang => $data) {
                $content[$lang] = array_merge([
                    'eyebrow' => '',
                    'title' => '',
                    'intro' => '',
                    'body' => '',
                    'sections' => [],
                    'pdf' => null,
                    'gallery' => [],
                ], $data);
            }

            CmsPage::updateOrCreate(
                ['slug' => $slug],
                [
                    'template' => 'standard',
                    'is_published' => true,
                    'content' => $content,
                ]
            );
        }
    }
}
