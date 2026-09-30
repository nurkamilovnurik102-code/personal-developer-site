-- NURISLAM / DEV — Supabase CMS setup
-- Run this once in Supabase SQL Editor.

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  developer_name text,
  brand text,
  hero_title_kg text,
  hero_title_ru text,
  hero_subtitle_kg text,
  hero_subtitle_ru text,
  about_title_kg text,
  about_title_ru text,
  about_text_kg text,
  about_text_ru text,
  mission_kg text,
  mission_ru text,
  email text,
  phone text,
  whatsapp text,
  location_kg text,
  location_ru text,
  music_url text,
  music_enabled boolean not null default false,
  footer_note_kg text,
  footer_note_ru text,
  updated_at timestamptz default now()
);

create table if not exists public.services (
  id text primary key,
  slug text unique not null,
  sort_order integer not null default 99,
  title_kg text not null,
  title_ru text not null,
  short_kg text not null,
  short_ru text not null,
  details_kg text,
  details_ru text,
  demo_url text,
  video_url text,
  image_url text,
  active boolean not null default true,
  updated_at timestamptz default now()
);

create table if not exists public.portfolio_projects (
  id text primary key,
  slug text unique not null,
  sort_order integer not null default 99,
  category text not null default 'business',
  title_kg text not null,
  title_ru text not null,
  summary_kg text,
  summary_ru text,
  problem_kg text,
  problem_ru text,
  solution_kg text,
  solution_ru text,
  features_kg text,
  features_ru text,
  technologies text,
  demo_url text,
  video_url text,
  image_url text,
  tone text default 'navy',
  active boolean not null default true,
  updated_at timestamptz default now()
);

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

alter table public.site_admins enable row level security;

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.site_admins where user_id = auth.uid());
$$;

revoke all on function public.is_site_admin() from public;
grant execute on function public.is_site_admin() to authenticated;

alter table public.site_settings enable row level security;
alter table public.services enable row level security;
alter table public.portfolio_projects enable row level security;

drop policy if exists "Public can read settings" on public.site_settings;
create policy "Public can read settings" on public.site_settings for select using (true);

drop policy if exists "Authenticated can manage settings" on public.site_settings;
drop policy if exists "Admin can manage settings" on public.site_settings;
create policy "Admin can manage settings" on public.site_settings for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

drop policy if exists "Public can read active services" on public.services;
create policy "Public can read active services" on public.services for select using (active = true);

drop policy if exists "Authenticated can manage services" on public.services;
drop policy if exists "Admin can manage services" on public.services;
create policy "Admin can manage services" on public.services for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());
drop policy if exists "Public can read active projects" on public.portfolio_projects;
create policy "Public can read active projects" on public.portfolio_projects for select using (active = true);

drop policy if exists "Admin can manage projects" on public.portfolio_projects;
create policy "Admin can manage projects" on public.portfolio_projects for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());


insert into public.site_settings (id, developer_name, brand, hero_title_kg, hero_title_ru, hero_subtitle_kg, hero_subtitle_ru, about_title_kg, about_title_ru, about_text_kg, about_text_ru, mission_kg, mission_ru, email, phone, whatsapp, location_kg, location_ru, footer_note_kg, footer_note_ru)
values (
  1,
  'Нурислам',
  'NURISLAM / DEV',
  'Сизге кандай сайт керек? Мисалдарды көрүп, ылайыктуу чечимди оңой тандаңыз.',
  'Какой сайт вам нужен? Посмотрите примеры и легко выберите подходящее решение.',
  'Бул жерде бизнес, иш-чара, жеке жана интерактивдүү сайттардын түрлөрүн көрүп, кандай иштей турганымды жана проектти кантип баштоону түшүнө аласыз.',
  'Здесь вы можете посмотреть варианты сайтов для бизнеса, событий, личных задач и интерактивных проектов, понять мой подход и как начать работу.',
  'Мен Нурислам — frontend developer.',
  'Я Нурислам — frontend-разработчик.',
  'Frontend курсун аяктап, React жана заманбап web-инструменттер менен практикалык проекттерди жасап жатам. Максатым — Кыргызстандагы бизнеске жана адамдарга маалыматты ыңгайлуу көрсөтүп, заказ, байланыш жана күнүмдүк иштерди жеңилдеткен сапаттуу web-чечимдерди түзүү.',
  'Я окончил курс frontend-разработки и развиваюсь через практические проекты на React и современных web-инструментах. Моя цель — создавать понятные решения, которые помогают бизнесу и людям в Кыргызстане удобнее показывать информацию, получать обращения и упрощать повседневную работу.',
  'Кыргызстандагы чакан бизнеске жана адамдарга жөнөкөй, ишенимдүү жана пайдалуу санариптик инструменттерди жеткиликтүү кылуу.',
  'Делать понятные, надёжные и полезные цифровые инструменты доступнее для малого бизнеса и людей в Кыргызстане.',
  'hello@example.com', '+996 000 000 000', '', 'Бишкек, Кыргызстан', 'Бишкек, Кыргызстан',
  'Сайттар жана web-чечимдер: түшүнүктүү, адаптивдүү жана кардарга ыңгайлуу.',
  'Сайты и web-решения: понятно, адаптивно и удобно для клиента.'
)
on conflict (id) do nothing;

insert into public.services (id, slug, sort_order, title_kg, title_ru, short_kg, short_ru, details_kg, details_ru, active)
values
('business','business',1,'Бизнес үчүн сайттар','Сайты для бизнеса','Landing, каталог, QR-меню, кызматтар, WhatsApp заявкасы жана брондоо.','Лендинги, каталоги, QR-меню, услуги, заявки в WhatsApp и бронирование.','Кафе, дүкөн, салон, кызмат көрсөтүүчү адис же компания үчүн түшүнүктүү сайт.','Понятный сайт для кафе, магазина, салона, специалиста или компании.',true),
('events','events',2,'Иш-чара жана чакыруу','События и приглашения','Той, үйлөнүү үлпөтү, юбилей жана башка иш-чаралар үчүн интерактивдүү чакыруу.','Интерактивные приглашения на той, свадьбу, юбилей и другие события.','Дата, таймер, карта, программа, сүрөт жана RSVP бир сайтта.','Дата, таймер, карта, программа, фото и RSVP в одном сайте.',true),
('personal','personal',3,'Жеке сайттар','Личные сайты','Портфолио, резюме, биография, белек-сайт жана жеке тарых.','Портфолио, резюме, биография, сайт-подарок и личная история.','Бир шилтемеде өзүңүздү, тажрыйбаңызды, иштериңизди же өзгөчө идеяңызды көрсөтүү.','Показать себя, опыт, работы или личную идею в одной удобной ссылке.',true),
('interactive','interactive',4,'Интерактивдүү проекттер','Интерактивные проекты','Квиз, мини-оюн, окуу сервиси, калькулятор жана атайын web-интерфейс.','Квизы, мини-игры, обучение, калькуляторы и специальные web-интерфейсы.','Кадимки сайттан башка, аракет жана тандоо бар интерактивдүү чечимдер.','Решения с действиями и выбором пользователя, а не только обычная страница.',true)
on conflict (id) do nothing;


insert into public.portfolio_projects (id, slug, sort_order, category, title_kg, title_ru, summary_kg, summary_ru, problem_kg, problem_ru, solution_kg, solution_ru, features_kg, features_ru, technologies, demo_url, video_url, image_url, tone, active)
values
('cafe','cafe',1,'business','Кафе үчүн QR-меню','QR-меню для кафе','Кафе үчүн тез ачылган mobile-first QR-меню жана байланыш баракчасы.','Быстрое mobile-first QR-меню и контактная страница для кафе.','Кардар менюну, даректи жана байланыштарды ар кайсы жерден издөөгө мажбур болбошу керек.','Клиент не должен искать меню, адрес и контакты в разных местах.','Меню, карта, WhatsApp жана негизги маалыматты бир жеңил сайтка чогултуу.','Собрать меню, карту, WhatsApp и важную информацию на одной лёгкой странице.','Категорияланган меню
WhatsApp аркылуу байланыш
Карта жана иш убактысы','Меню по категориям
Связь через WhatsApp
Карта и часы работы','React, Vite, Responsive UI','','','','navy',true),
('dental','dental',2,'business','Стоматология үчүн сайт','Сайт для стоматологии','Стоматология үчүн кызматтар, дарыгерлер жана жазылуу логикасы бар бизнес-сайт.','Бизнес-сайт стоматологии с услугами, врачами и логикой записи.','Клиент кызмат, баа жана кимге жазыларын тез түшүнүшү керек.','Клиенту важно быстро понять услугу, стоимость и к кому обратиться.','Таза структура, ишеним жараткан маалымат жана бир нече кадамдагы жазылуу CTA.','Чистая структура, понятная информация и заметный путь к записи.','Кызматтар блогу
Дарыгерлер профили
Жазылуу формасы','Блок услуг
Профили врачей
Форма записи','React, Forms, Responsive UI','','','','blue',true),
('beauty','beauty',3,'business','Beauty Booking','Сайт салона и запись','Салон үчүн кызматтар, адистер жана жазылууга алып баруучу визуалдык сайт.','Визуальный сайт салона с услугами, специалистами и записью.','Instagram''дагы маалымат көп учурда чачыранды болуп калат.','В Instagram информация об услугах и ценах часто разбросана.','Кызматтарды, бааларды жана адистерди бир структурага чогултуу.','Собрать услуги, цены и специалистов в одной понятной структуре.','Кызмат жана баа
Адистер карточкасы
Жазылуу CTA','Услуги и цены
Карточки специалистов
CTA для записи','React, Vite, Booking UI','','','','soft',true),
('toy','toy',4,'events','Digital Той чакыруусу','Digital-приглашение на той','Той же юбилей үчүн интерактивдүү чакыруу сайты.','Интерактивный сайт-приглашение для тоя или юбилея.','Кадимки сүрөт-чакыруу карта, убакыт жана жооп чогултуу үчүн жетишсиз.','Обычная картинка не даёт удобно показать карту, время и собрать ответы гостей.','Дата, таймер, карта, программа жана RSVP бир сайтта.','Дата, таймер, карта, программа и RSVP на одной странице.','Countdown
Карта жана программа
RSVP формасы','Countdown
Карта и программа
RSVP форма','React, i18n, Responsive UI','','','','violet',true),
('portfolio','portfolio',5,'personal','Жеке портфолио','Личное портфолио','Адис үчүн тажрыйба, иштер жана байланыштарды көрсөтүүчү жеке сайт.','Персональный сайт специалиста с опытом, работами и контактами.','Социалдык тармак ар дайым профессионалдуу портфолиону толук алмаштыра албайт.','Социальная сеть не всегда полноценно заменяет профессиональное портфолио.','Бир шилтемеде тажрыйба, иштер жана байланышты көрсөтүү.','Показать опыт, проекты и контакты по одной удобной ссылке.','Case studies
Тажрыйба жана көндүмдөр
Contact CTA','Case studies
Опыт и навыки
Contact CTA','React, Router, SEO basics','','','','cyan',true),
('love','love',6,'personal','Интерактивдүү белек-сайт','Интерактивный сайт-подарок','Белек, эскерүү же өзгөчө суроо үчүн персоналдуу интерактивдүү сайт.','Персональный интерактивный сайт для подарка, воспоминаний или особого вопроса.','Кээ бир белектер материалдык эмес, эмоция жана жеке маанай аркылуу баалуу болот.','Некоторые подарки ценны не вещью, а эмоцией и личным смыслом.','Сүрөт, текст жана кичине интерактивдерди бир окуяга айлантуу.','Объединить фотографии, текст и небольшие интерактивы в одну историю.','Фото окуя
Мини-интерактив
Персоналдуу финал','Фото-история
Мини-интерактив
Персональный финал','React, Interactive UI, Responsive UI','','','','rose',true)
on conflict (id) do nothing;

-- Storage bucket for music and service cover files.
insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do update set public = true;

-- Public read; authenticated admin upload/update/delete.
drop policy if exists "Public read site media" on storage.objects;
create policy "Public read site media" on storage.objects for select using (bucket_id = 'site-media');

drop policy if exists "Authenticated upload site media" on storage.objects;
drop policy if exists "Admin upload site media" on storage.objects;
create policy "Admin upload site media" on storage.objects for insert to authenticated with check (bucket_id = 'site-media' and public.is_site_admin());

drop policy if exists "Authenticated update site media" on storage.objects;
drop policy if exists "Admin update site media" on storage.objects;
create policy "Admin update site media" on storage.objects for update to authenticated using (bucket_id = 'site-media' and public.is_site_admin()) with check (bucket_id = 'site-media' and public.is_site_admin());

drop policy if exists "Authenticated delete site media" on storage.objects;
drop policy if exists "Admin delete site media" on storage.objects;
create policy "Admin delete site media" on storage.objects for delete to authenticated using (bucket_id = 'site-media' and public.is_site_admin());

-- IMPORTANT: after creating your admin user in Supabase Authentication,
-- copy its UUID and run this once (replace the UUID):
-- insert into public.site_admins (user_id) values ('YOUR-AUTH-USER-UUID');
