import type { NextConfig } from "next";


/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true, // <-- ADICIONE ESTA LINHA
};

module.exports = nextConfig;