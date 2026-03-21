--
-- PostgreSQL database dump
--

\restrict Ylu8lZKHMVLLbGZE44fCrabSc6XvkQ57vlvJN8cx50mtidvjNSqv6MOBnWjDctY

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.profiles VALUES (1, 1, 3, 'Admin User', '9876543210', 0.00, NULL, '2026-03-20 15:48:17.757071+05:30', '2026-03-20 15:48:17.757071+05:30', NULL);
INSERT INTO public.profiles VALUES (2, 2, 2, 'Imran Khan', '9876543211', 0.00, NULL, '2026-03-20 15:48:17.760664+05:30', '2026-03-20 15:48:17.760664+05:30', NULL);
INSERT INTO public.profiles VALUES (3, 3, 2, 'Suresh Reddy', '9876543212', 0.00, NULL, '2026-03-20 15:48:17.763203+05:30', '2026-03-20 15:48:17.763203+05:30', NULL);
INSERT INTO public.profiles VALUES (4, 4, 1, 'Ravi Kumar', '8765432100', 1500.00, NULL, '2026-03-20 15:48:17.764911+05:30', '2026-03-20 15:48:17.764911+05:30', NULL);
INSERT INTO public.profiles VALUES (5, 5, 1, 'Sneha Reddy', '8765432101', 2200.00, NULL, '2026-03-20 15:48:17.766345+05:30', '2026-03-20 15:48:17.766345+05:30', NULL);
INSERT INTO public.profiles VALUES (6, 6, 1, 'Arjun Rao', '8765432102', 850.00, NULL, '2026-03-20 15:48:17.767719+05:30', '2026-03-20 15:48:17.767719+05:30', NULL);
INSERT INTO public.profiles VALUES (7, 7, 1, 'Test collector 5 ', '0987654321', 0.00, NULL, '2026-03-20 16:00:56.664618+05:30', '2026-03-20 16:00:56.664618+05:30', NULL);


--
-- Name: profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.profiles_id_seq', 7, true);


--
-- PostgreSQL database dump complete
--

\unrestrict Ylu8lZKHMVLLbGZE44fCrabSc6XvkQ57vlvJN8cx50mtidvjNSqv6MOBnWjDctY

