import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  entry: './src/index.ts',
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    extensionAlias: {
      '.js': ['.js', '.ts'],
    },
  },
  output: {
    filename: 'python2ib.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'Python2IB',
    libraryTarget: 'umd',
    globalObject: 'this',
  },
  target: 'web',
  optimization: {
    minimize: true,
  },
};