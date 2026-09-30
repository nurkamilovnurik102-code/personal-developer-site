# Админ панельди иштетүү

Админ дареги: `/admin`

## 1. Тез тест — Local demo

`.env.local` файл түз:

```env
VITE_LOCAL_ADMIN_PASSWORD=өзүңдүн-тест-паролуң
```

Андан кийин:

```bash
npm run dev
```

`http://localhost:5173/admin` ачып пароль менен кир.

**Маанилүү:** Local demo өзгөртүүлөрдү ошол браузердин `localStorage` бөлүгүндө гана сактайт. Бул production үчүн эмес.

## 2. Production — Supabase CMS

1. Supabase'та жаңы project ач.
2. SQL Editor'до `supabase/setup.sql` файлын толугу менен иштет.
3. Authentication бөлүмүнөн өзүңө admin user түз (email + password).
4. Ошол user'дин UUID'син көчүр.
5. SQL Editor'до төмөнкүнү иштет:

```sql
insert into public.site_admins (user_id)
values ('YOUR-AUTH-USER-UUID');
```

6. Supabase Project Settings → API бөлүмүнөн Project URL жана anon/publishable key ал.
7. `.env.local`:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_KEY
```

8. Vercel'де дагы ушул 2 Environment Variable кош.
9. Deploy кыл.

## 3. Админден эмнени башкарасың

- Кызмат кошуу / өзгөртүү / өчүрүү / жашыруу.
- Портфолио проект кошуу / өзгөртүү / өчүрүү / жашыруу.
- KG жана RU аталыштарын, түшүндүрмөлөрдү өзгөртүү.
- Demo сайт шилтемесин кошуу.
- Обзор видео шилтемесин кошуу.
- Cover сүрөттү URL менен же файл upload аркылуу кошуу.
- Башкы Hero заголовок жана текст.
- Нурислам аты/бренд.
- Телефон, WhatsApp, email, location.
- «Мен жөнүндө» жана максат тексттери.
- Музыка URL же аудио файл upload.
- Музыканы көрсөтүү/өчүрүү.
- Admin пароль жаңылоо.

## 4. WhatsApp заявка

Админ → **Сайт маалыматы** → `WhatsApp номер` талаасына мисалы:

```text
996555123456
```

Клиент форма толтурганда сайт даяр билдирүү менен WhatsApp ачат. Клиент акыркы `Send` баскычын өзү басат.

## 5. Коопсуздук

- `service_role` key'ди Vite/Frontend'ке ЭЧ КАЧАН кошпо.
- Frontend'те public anon/publishable key гана колдонулат.
- Database жана Storage жазуу укугу `site_admins` таблицасындагы admin user'ге гана берилет.
- Админ пароль Supabase Auth'та сакталат, source code'до эмес.
- `/admin` URL жашыруун сыр эмес; коопсуздук login + RLS аркылуу камсыздалат.
