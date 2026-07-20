<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>男性Live2D角色</title>
</head>
<body>
  <h1>👨 左下角就是男性角色（Mao）</h1>
  <p>试试拖拽他、点击他</p>

  <!-- ⚠️ 注意：是 l2d（字母L），不是 12d（数字1） -->
  <script src="https://cdn.jsdelivr.net/npm/@chnak/l2d-widget/dist/index.min.js">
  </script>

  <script>
    const { createWidget } = L2DWidget;

    // 使用官方男性模型 "Mao"（短发男生）
    createWidget({
      model: {
        path: 'https://cdn.jsdelivr.net/npm/@live2d-models/model-mao@1.0.0/model.json',
      },
      position: 'bottom-left',
      draggable: true,
    });
  </script>
</body>
</html>
