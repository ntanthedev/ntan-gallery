insert into public.admin_profile (user_id, email, role)
values (
  'b23fe403-ec7b-42fa-b8a6-dc0b93a73e42',
  'nhattanff07@gmail.com',
  'owner'
)
on conflict (user_id) do nothing;

insert into public.friends (
  slug,
  name,
  nickname,
  description,
  letter_content,
  access_key_hash,
  gallery_photos,
  main_photo,
  theme_config,
  order_index
)
values (
  'demo-friend',
  'Người bạn đầu tiên',
  'Demo',
  'Bạn thân thân giúp test hệ thống.',
  $md$
## Xin chào!

Đây là thư demo để đảm bảo layout markdown hoạt động.

- Bước 1: nhập key `demo-key`
- Bước 2: đọc thư và xem gallery

Yêu bạn ❤️
$md$,
  crypt('demo-key', gen_salt('bf', 12)),
  array[
    'friends/demo/1.jpg',
    'friends/demo/2.jpg'
  ],
  'friends/demo/main.jpg',
  jsonb_build_object(
    'primary', '#FF6B6B',
    'secondary', '#4ECDC4',
    'font', 'Inter'
  ),
  1
)
on conflict (slug) do nothing;

