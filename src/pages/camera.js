import { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';

import Layout from '@components/Layout';
import Container from '@components/Container';
import CldCamera from '@components/CldCamera';

export default function Camera() {
  return <CldCamera />
}