try {
  const { init } = await import("./controllers/bootstrap.js");
  await init();
} catch (error) {
  console.error("MnM startup failed", error);
  const message = document.createElement("p");
  message.textContent =
    "菜单暂时无法加载，请刷新重试。 / Menu unavailable. Please refresh.";
  message.setAttribute("role", "alert");
  document.querySelector("#menu").prepend(message);
}
